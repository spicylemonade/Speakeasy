from playwright.sync_api import sync_playwright
import json
import time
import sys
import os

DEFAULT_PROFILE_DIR = 'Default'

def scrape_all_tweets(username, cdp_port=9222, scroll_delay=1, max_idle_scrolls=5):
    """
    Scrape tweets by connecting to an existing Chrome browser session using CDP.
    """
    final_data = {
        "twitter": {
            "profile": {},
            "tweets": []
        },
        "speakeasy": {
            "posts": [
                {"post_id": 1, "content": f"This is a mock post from Speakeasy for {username}", "timestamp": "2023-10-27T10:00:00Z"},
                {"post_id": 2, "content": "Feeling thoughtful today. #mindfulness", "timestamp": "2023-10-26T15:30:00Z"}
            ]
        }
    }
    data = final_data["twitter"]
    seen_texts = set()

    with sync_playwright() as playwright:
        try:
            # Connect to existing Chrome instance using CDP
            print(f"[INFO] Attempting to connect to Chrome via CDP on port {cdp_port}")
            print(f"[INFO] Make sure Chrome is running with: --remote-debugging-port={cdp_port}")
            
            browser = playwright.chromium.connect_over_cdp(f"http://localhost:{cdp_port}")
            
            # Get the default context and first page
            if len(browser.contexts) == 0:
                print("[ERROR] No browser contexts found. Please open Chrome and navigate to a page first.")
                return
                
            default_context = browser.contexts[0]
            
            # Check if there are existing pages, if not create one
            if len(default_context.pages) == 0:
                print("[INFO] Creating new page in existing browser context")
                page = default_context.new_page()
            else:
                print("[INFO] Using existing page in browser")
                page = default_context.pages[0]
            
            print(f"[SUCCESS] Connected to existing Chrome browser session")
            print(f"[INFO] Current page URL: {page.url}")
            
        except Exception as e:
            print(f"[ERROR] Could not connect to Chrome browser: {e}")
            print(f"[HELP] To fix this:")
            print(f"  1. Close all Chrome instances")
            print(f"  2. Start Chrome with: \"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe\" --remote-debugging-port={cdp_port}")
            print(f"  3. Navigate to X.com and log in")
            print(f"  4. Test the connection by visiting: http://localhost:{cdp_port}/json/version")
            print(f"  5. Run this script again")
            return

        # Navigate to the user's profile
        try:
            target_url = f"https://x.com/{username}"
            print(f"[INFO] Navigating to: {target_url}")
            page.goto(target_url)
            
            # Check for authentication by looking for login-related elements
            print("[INFO] Checking authentication status...")
            page.wait_for_timeout(3000)
            
            # Check if we're on a login page or if login is required
            login_selectors = [
                'a[href="/i/flow/login"]',
                'div[data-testid="loginButton"]',
                'input[name="text"]',
            ]
            
            is_logged_out = False
            for selector in login_selectors:
                if page.query_selector(selector):
                    is_logged_out = True
                    break
            
            if is_logged_out:
                print("[WARNING] It appears you are not logged in to X.com")
                print("[HELP] Please log in to X.com in the connected browser and try again")
            else:
                print("[SUCCESS] Appears to be logged in to X.com")
                
        except Exception as e:
            print(f"[ERROR] Failed to navigate to profile: {e}")
            return
        
        # Wait for either the primary column or a tweet element to load
        try:
            page.wait_for_selector('div[data-testid="primaryColumn"], div[data-testid="tweetText"], div[data-testid="UserName"]', timeout=30000)
            print("[SUCCESS] Profile page loaded")
        except Exception as e:
            print(f"[ERROR] Could not load profile page for {username}: {e}")
            print("[HELP] Make sure the username is correct and the profile is public")
            filename = f"{username}_data.json"
            with open(filename, "w", encoding="utf-8") as f:
                json.dump(final_data, f, indent=2, ensure_ascii=False)
            return

        # Extract basic profile info
        try:
            print("[INFO] Extracting profile information...")
            page.wait_for_timeout(2000)

            # Name
            try:
                name_elem = page.query_selector('div[data-testid="UserName"] span span')
                name = name_elem.inner_text() if name_elem else ""
            except:
                name = ""

            # Handle (@username)
            try:
                handle_elem = page.query_selector('div[data-testid="UserName"] > div + div span span')
                handle = handle_elem.inner_text() if handle_elem else f"@{username}"
            except:
                handle = f"@{username}"

            # Bio
            try:
                bio_elem = page.query_selector('div[data-testid="UserDescription"] span')
                bio = bio_elem.inner_text() if bio_elem else ""
            except:
                bio = ""

            data["profile"] = {
                "name": name,
                "handle": handle,
                "bio": bio,
                "profile_url": f"https://x.com/{username}"
            }
            
            print(f"[SUCCESS] Profile info extracted for: {name} ({handle})")
        except Exception as e:
            print(f"[WARNING] Profile info could not be fully extracted: {e}")

        print("[INFO] Starting tweet extraction...")
        
        idle_scrolls = 0
        tweet_count = 0

        while idle_scrolls < max_idle_scrolls:
            # Look for tweet articles
            tweet_wrappers = page.query_selector_all('article[role="article"]')
            new_count = 0

            for wrapper in tweet_wrappers:
                try:
                    # Extract tweet text
                    text_elem = wrapper.query_selector('div[data-testid="tweetText"]')
                    text = text_elem.inner_text().strip() if text_elem else ""

                    if text in seen_texts or not text:
                        continue

                    # Add tweet with just text
                    tweet_data = {
                        "text": text,
                        "images": [],
                        "image_count": 0
                    }
                    
                    data["tweets"].append(tweet_data)
                    seen_texts.add(text)
                    new_count += 1
                    tweet_count += 1

                except Exception as e:
                    continue

            print(f"[SCROLL] Scroll #{idle_scrolls + 1}: {new_count} new tweets found (Total: {tweet_count})")

            if new_count == 0:
                idle_scrolls += 1
            else:
                idle_scrolls = 0

            # Scroll down
            page.mouse.wheel(0, 2500)
            page.wait_for_timeout(scroll_delay * 1000)

        print(f"[SUCCESS] Finished scrolling. Total tweets collected: {len(data['tweets'])}")
        print("[INFO] Keeping browser session open (connected via CDP)")

    # Save to file
    filename = f"{username}_data.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(final_data, f, indent=2, ensure_ascii=False)

    print(f"[SUCCESS] Data saved to {filename}")


def start_chrome_debug():
    """Helper function to start Chrome in debug mode"""
    import subprocess
    import platform
    
    if platform.system() == "Windows":
        chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
        if not os.path.exists(chrome_path):
            chrome_path = r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
        
        if os.path.exists(chrome_path):
            print(f"[INFO] Starting Chrome in debug mode...")
            subprocess.Popen([chrome_path, "--remote-debugging-port=9222"])
            print(f"[SUCCESS] Chrome started. You can verify by visiting: http://localhost:9222/json/version")
        else:
            print(f"[ERROR] Chrome not found at expected paths")
    else:
        print(f"[INFO] For your OS, manually start Chrome with: --remote-debugging-port=9222")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        user = sys.argv[1]
    else:
        user = input("Provide an X (Twitter) username: ").strip()

    # Check if user wants to start Chrome in debug mode
    if len(sys.argv) > 2 and sys.argv[2] == "--start-chrome":
        start_chrome_debug()
        print("[INFO] Please log in to X.com and then run the script again without --start-chrome")
        sys.exit(0)

    cdp_port = int(sys.argv[2]) if len(sys.argv) > 2 and sys.argv[2].isdigit() else 9222

    scrape_all_tweets(user, cdp_port) 