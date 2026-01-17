import json
import subprocess
import time
from pathlib import Path

# ================= CONFIG =================

AUDIO_OGG = "../recordings/call_call_123.ogg"
STATE_FILE = "state.json"

CHUNK_DURATION = 5   # seconds
POLL_INTERVAL = 3    # seconds

TRANSCRIPTS_DIR = Path("transcripts")
TRANSCRIPTS_DIR.mkdir(exist_ok=True)

# ================= STATE =================

def load_state():
    if not Path(STATE_FILE).exists():
        return 0
    with open(STATE_FILE) as f:
        return json.load(f).get("last_processed_seconds", 0)

def save_state(sec):
    with open(STATE_FILE, "w") as f:
        json.dump({"last_processed_seconds": sec}, f)

# ================= AUDIO UTILS =================

def get_audio_duration():
    """Return duration of audio in seconds"""
    try:
        cmd = [
            "ffprobe",
            "-v", "error",
            "-show_entries", "format=duration",
            "-of", "json",
            AUDIO_OGG
        ]
        out = subprocess.check_output(cmd)
        return float(json.loads(out)["format"]["duration"])
    except Exception:
        return 0.0

def extract_chunk(start, index):
    wav_file = Path(f"chunk_{index}.wav")

    cmd = [
        "ffmpeg",
        "-y",
        "-ss", str(start),
        "-t", str(CHUNK_DURATION),
        "-i", AUDIO_OGG,
        "-ar", "16000",
        "-ac", "1",
        wav_file.as_posix()
    ]

    subprocess.run(
        cmd,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    return wav_file

def is_valid_audio(wav_file):
    return wav_file.exists() and wav_file.stat().st_size > 1000

# ================= TRANSCRIPTION =================

def transcribe(wav_file):
    cmd = [
        "whisper",
        wav_file.as_posix(),
        "--model", "small",
        "--language", "en",
        "--output_format", "json",
        "--output_dir", str(TRANSCRIPTS_DIR)
    ]
    subprocess.run(cmd)

# ================= MAIN LOOP =================

if __name__ == "__main__":
    print("🧠 Auto chunk transcription worker started")

    while True:
        if not Path(AUDIO_OGG).exists():
            print("⏳ Waiting for audio file...")
            time.sleep(POLL_INTERVAL)
            continue

        last_sec = load_state()
        total_duration = get_audio_duration()

        # Stop if audio ended
        if total_duration > 0 and last_sec >= total_duration:
            print("✅ Recording ended. Stopping worker.")
            break

        chunk_index = int(last_sec // CHUNK_DURATION)
        print(f"⏱️ Processing chunk {chunk_index} (from {last_sec}s)")

        wav = extract_chunk(last_sec, chunk_index)

        # Stop if chunk is empty
        if not is_valid_audio(wav):
            print("⚠️ Empty or invalid audio chunk detected.")
            print("✅ Assuming recording finished. Stopping worker.")
            break

        transcribe(wav)

        save_state(last_sec + CHUNK_DURATION)
        time.sleep(POLL_INTERVAL)

    print("🛑 Transcription worker stopped")
