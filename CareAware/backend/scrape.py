from playwright.sync_api import sync_playwright
import json
import time

def scrape_all_tweets(username, scroll_delay=2, max_idle_scrolls=5):
    data = {"profile": {}, "tweets": []}
    seen_texts = set()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, slow_mo=50)
        context = browser.new_context()
        page = context.new_page()

        print(f"Opening profile: https://x.com/{username}")
        page.goto(f"https://x.com/{username}")
        page.wait_for_timeout(500)

        # Extract basic profile info
        try:
            # Wait for page to fully render
            page.wait_for_timeout(500)

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

            # Wait for page to fully render
            page.wait_for_timeout(8000)

            data["profile"] = {
                "name": name,
                "handle": handle,
                "bio": bio,
                "profile_url": f"https://x.com/{username}"
            }
        except Exception as e:
            print("Profile info could not be fully extracted:", e)

        print("✅ Profile info scraped.")
        print("📜 Starting tweet extraction...")

        
        idle_scrolls = 0
        last_tweet_count = 0

        while idle_scrolls < max_idle_scrolls:
            tweet_blocks = page.query_selector_all('div[data-testid="tweetText"]')
            new_count = 0
            for t in tweet_blocks:
                try:
                    text = t.inner_text().strip()
                    if text and text not in seen_texts:
                        data["tweets"].append(text)
                        seen_texts.add(text)
                        new_count += 1
                except:
                    continue

            print(f"➡️ Scroll #{idle_scrolls + 1}: {new_count} new tweets")

            if new_count == 0:
                idle_scrolls += 1
            else:
                idle_scrolls = 0

            page.mouse.wheel(0, 2500)
            page.wait_for_timeout(scroll_delay * 1000)

        print(f"✅ Finished scrolling. Total tweets collected: {len(data['tweets'])}")
        

        browser.close()

    # Save to file
    filename = f"{username}_data.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"💾 Data saved to {filename}")


if __name__ == "__main__":
    user = input("Provide an X (Twitter) username: ").strip()
    scrape_all_tweets(user)
