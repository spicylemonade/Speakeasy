import speech_recognition as sr
import pyaudio
import json
import datetime

r = sr.Recognizer()

with sr.Microphone() as source:
    print("Say something!")
    try:
        # Optional: reduce noise
        r.adjust_for_ambient_noise(source, duration=1)

        audio = r.listen(source)
        print("Recognizing...")
        text = r.recognize_google(audio)

        print(f"You said: {text}")

        # Create JSON structure
        result = {
            "timestamp": datetime.datetime.now().isoformat(),
            "transcription": text
        }

        # Save to JSON file
        with open("result.json", "w") as f:
            json.dump(result, f, indent=4)

        print("Saved to result.json")

    except sr.UnknownValueError:
        print("Could not understand audio")
    except sr.RequestError as e:
        print(f"Could not request results from Google Speech Recognition service; {e}")
