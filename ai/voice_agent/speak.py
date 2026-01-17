from reasoning.suggested_reply import mock_llm
from reasoning.aggregate_transcript import aggregate
from reasoning.context import load_context
from tts.tts import text_to_speech

CALL_ID = "call_123"

def generate_ai_speech():
    convo = aggregate()["conversation"]
    context = load_context(CALL_ID)

    # reuse reply logic
    reply = mock_llm(" ".join(c["text"] for c in convo))

    audio = text_to_speech(
        reply["reply"],
        f"{CALL_ID}_ai.wav"
    )

    print("AI said:", reply["reply"])
    print("Audio file:", audio)

if __name__ == "__main__":
    generate_ai_speech()
