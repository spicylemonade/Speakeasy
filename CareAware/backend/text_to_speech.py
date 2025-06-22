import asyncio
import json
import sys
import os
from lmnt.api import Speech

LMNT_API_KEY = "ak_GkxGopYg9FwhJaQkJ9huMC"  # Your API key

def load_text_from_json(path):
    """Load text from JSON file"""
    try:
        with open(path, 'r') as f:
            data = json.load(f)
            return data.get("text", "")
    except Exception as e:
        return ""

async def synthesize_speech(text, output_path="output.wav", voice="lily"):
    """
    Convert text to speech using LMNT API
    """
    try:
        if not text.strip():
            return {
                "success": False,
                "error": "No text provided for synthesis"
            }
        
        async with Speech(LMNT_API_KEY) as speech:
            synthesis = await speech.synthesize(text, voice=voice, format='wav')
            
            with open(output_path, 'wb') as f:
                f.write(synthesis['audio'])
            
            return {
                "success": True,
                "output_file": output_path,
                "text": text,
                "voice": voice,
                "message": f"Speech synthesized successfully and saved to {output_path}"
            }
            
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to synthesize speech: {str(e)}"
        }

async def main():
    if len(sys.argv) > 1:
        # If JSON input file is provided
        json_input_path = sys.argv[1]
        output_path = sys.argv[2] if len(sys.argv) > 2 else "output.wav"
        voice = sys.argv[3] if len(sys.argv) > 3 else "lily"
        
        if os.path.exists(json_input_path):
            input_text = load_text_from_json(json_input_path)
        else:
            result = {
                "success": False,
                "error": f"Input JSON file not found: {json_input_path}"
            }
            print(json.dumps(result, indent=2))
            return
            
    elif len(sys.argv) == 1:
        # Direct text input from command line
        print("Usage: python text_to_speech.py <json_file> [output_file] [voice]")
        print("   or: python text_to_speech.py")
        return
    else:
        input_text = " ".join(sys.argv[1:])
        output_path = "output.wav"
        voice = "lily"
    
    if not input_text:
        result = {
            "success": False,
            "error": "No text found for synthesis"
        }
    else:
        result = await synthesize_speech(input_text, output_path, voice)
    
    # Output JSON result
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    asyncio.run(main()) 