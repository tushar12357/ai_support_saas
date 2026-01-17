import pyttsx3
from pathlib import Path

# FORCE Windows voice engine
engine = pyttsx3.init("sapi5")

engine.setProperty("rate", 170)
engine.setProperty("volume", 1.0)

voices = engine.getProperty("voices")
engine.setProperty("voice", voices[0].id)

OUT_DIR = Path("voice")
OUT_DIR.mkdir(exist_ok=True)

def text_to_speech(text: str, filename: str):
    path = OUT_DIR / filename
    engine.say(text)
    engine.runAndWait()
    return path

if __name__ == "__main__":
    print("🔊 Speaking now...")
    text_to_speech(
        "Hello, this is a text to speech test.",
        "test.wav"
    )
