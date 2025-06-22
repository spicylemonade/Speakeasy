import speech_recognition as sr
import pyaudio
import json
import datetime
import sys
import os

def transcribe_audio_file(audio_file_path):
    """
    Transcribe audio from a file path
    """
    r = sr.Recognizer()
    
    try:
        with sr.AudioFile(audio_file_path) as source:
            # Adjust for ambient noise
            r.adjust_for_ambient_noise(source, duration=0.5)
            audio = r.record(source)
            
        print("Recognizing speech...", file=sys.stderr)
        text = r.recognize_google(audio)
        
        result = {
            "success": True,
            "timestamp": datetime.datetime.now().isoformat(),
            "transcription": text,
            "confidence": 0.95  # Google API doesn't provide confidence, so we use a default
        }
        
        return result
        
    except sr.UnknownValueError:
        return {
            "success": False,
            "error": "Could not understand audio",
            "timestamp": datetime.datetime.now().isoformat()
        }
    except sr.RequestError as e:
        return {
            "success": False,
            "error": f"Could not request results from Google Speech Recognition service: {e}",
            "timestamp": datetime.datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Unexpected error: {e}",
            "timestamp": datetime.datetime.now().isoformat()
        }

def transcribe_from_microphone():
    """
    Transcribe audio from microphone (for testing)
    """
    r = sr.Recognizer()
    
    try:
        with sr.Microphone() as source:
            print("Listening... Speak now!", file=sys.stderr)
            # Adjust for ambient noise
            r.adjust_for_ambient_noise(source, duration=1)
            audio = r.listen(source, timeout=5, phrase_time_limit=10)
            
        print("Recognizing speech...", file=sys.stderr)
        text = r.recognize_google(audio)
        
        result = {
            "success": True,
            "timestamp": datetime.datetime.now().isoformat(),
            "transcription": text,
            "confidence": 0.95
        }
        
        return result
        
    except sr.WaitTimeoutError:
        return {
            "success": False,
            "error": "No speech detected within timeout period",
            "timestamp": datetime.datetime.now().isoformat()
        }
    except sr.UnknownValueError:
        return {
            "success": False,
            "error": "Could not understand audio",
            "timestamp": datetime.datetime.now().isoformat()
        }
    except sr.RequestError as e:
        return {
            "success": False,
            "error": f"Could not request results from Google Speech Recognition service: {e}",
            "timestamp": datetime.datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Unexpected error: {e}",
            "timestamp": datetime.datetime.now().isoformat()
        }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # If audio file path is provided
        audio_file_path = sys.argv[1]
        if os.path.exists(audio_file_path):
            result = transcribe_audio_file(audio_file_path)
        else:
            result = {
                "success": False,
                "error": f"Audio file not found: {audio_file_path}",
                "timestamp": datetime.datetime.now().isoformat()
            }
    else:
        # Use microphone
        result = transcribe_from_microphone()
    
    # Output JSON result
    print(json.dumps(result, indent=2)) 