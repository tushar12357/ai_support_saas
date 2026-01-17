import json
from pathlib import Path

TRANSCRIPTS_DIR = Path("transcripts")

def aggregate():
    conversation = []

    chunk_files = sorted(
        TRANSCRIPTS_DIR.glob("chunk_*.json"),
        key=lambda f: int(f.stem.split("_")[1])
    )

    for file in chunk_files:
        chunk_index = int(file.stem.split("_")[1])

        with open(file) as f:
            data = json.load(f)

        text = " ".join(seg["text"] for seg in data.get("segments", []))

        if text.strip():
            conversation.append({
                "chunk": chunk_index,
                "text": text.strip()
            })

    return {
        "callId": "call_123",
        "conversation": conversation
    }

if __name__ == "__main__":
    convo = aggregate()
    print(json.dumps(convo, indent=2))
