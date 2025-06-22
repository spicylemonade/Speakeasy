import asyncio
import json
from lmnt.api import Speech

LMNT_API_KEY = "ak_GkxGopYg9FwhJaQkJ9huMC"  # Fill in your API key
JSON_INPUT_PATH = "input.json"  # Change if needed

def load_text_from_json(path):
    with open(path, 'r') as f:
        data = json.load(f)
        return data.get("text", "")  # Default to empty string if "text" not found

async def main():
    input_text = load_text_from_json(JSON_INPUT_PATH)

    if not input_text:
        print("No 'text' key found in the JSON.")
        return

    async with Speech(LMNT_API_KEY) as speech:
        synthesis = await speech.synthesize(input_text, voice='lily', format='wav')
        with open('output.wav', 'wb') as f:
            f.write(synthesis['audio'])

asyncio.run(main())
