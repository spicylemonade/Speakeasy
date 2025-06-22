from playwright.sync_api import sync_playwright
import json
import time
import requests
import os
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import torch

# Load BLIP model and processor
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

def download_image(url, save_path):
    try:
        r = requests.get(url)
        with open(save_path, 'wb') as f:
            f.write(r.content)
        return True
    except:
        return False

def generate_caption(image_path):
    try:
        raw_image = Image.open(image_path).convert('RGB')
        inputs = processor(raw_image, return_tensors="pt")
        out = model.generate(**inputs)
        return processor.decode(out[0], skip_special_tokens=True)
    except:
        return ""

def scrape_all_tweets(username, scroll_delay=2, max_idle_scrolls=5):
    data = {"profile": {}, "tweets": []}
    seen_texts = set()
    image_dir = f"{username}_images"
    os.makedirs(image_dir, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, slow_mo=50)
        context = browser.new_context()
        page = context.new_page()

        print(f"Opening profile: https://x.com/{username}")
        page.goto(f"https://x.com/{username}")
        page.wait_for_timeout(1000)

        # Extract profile info
        try:
            page.wait_for_timeout(5000)
            name_elem = page.query_selector('div[data-testid="UserName"] span span')
            name = name_elem.inner_text() if name_elem else ""
            handle_elem = page.query_selector('div[data-testid="UserName"] > div + div span span')
            handle = handle_elem.inner_text() if handle_elem else f"@{username}"
            bio_elem = page.query_selector('div[data-testid="UserDescription"] span')
            bio = bio_elem.inner_text() if bio_elem else ""

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
        while idle_scrolls < max_idle_scrolls:
            tweet_wrappers = page.query_selector_all('article[role="article"]')
            new_count = 0

            for wrapper in tweet_wrappers:
                try:
                    text_elem = wrapper.query_selector('div[data-testid="tweetText"]')
                    text = text_elem.inner_text().strip() if text_elem else ""

                    if text in seen_texts:
                        continue

                    image_elems = wrapper.query_selector_all('img[src*="twimg.com/media"]')
                    image_urls = [img.get_attribute("src") for img in image_elems if img.get_attribute("src")]

                    image_info = []
                    for idx, url in enumerate(image_urls):
                        filename = os.path.join(image_dir, f"{username}_{len(data['tweets'])}_{idx}.jpg")
                        if download_image(url, filename):
                            caption = generate_caption(filename)
                            image_info.append({"url": url, "caption": caption})

                    data["tweets"].append({"text": text, "images": image_info})
                    seen_texts.add(text)
                    new_count += 1
                except Exception as e:
                    continue

            print(f"➡️ Scroll #{idle_scrolls + 1}: {new_count} new tweets")
            idle_scrolls = 0 if new_count > 0 else idle_scrolls + 1

            page.mouse.wheel(0, 2500)
            page.wait_for_timeout(scroll_delay * 1000)

        print(f"✅ Finished scrolling. Total tweets collected: {len(data['tweets'])}")
        browser.close()

    filename = f"{username}_data.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"💾 Data saved to {filename}")

if __name__ == "__main__":
    user = input("Provide an X (Twitter) username: ").strip()
    scrape_all_tweets(user)
