import json
from .aggregate_transcript import aggregate

SENTIMENTS = ["calm", "confused", "frustrated", "angry"]

def build_prompt(conversation):
    convo_text = "\n".join(
        f"- {item['text']}" for item in conversation
    )

    return f"""
You are an AI customer support system.

Conversation so far:
{convo_text}

Task:
Determine the customer's current emotional sentiment from:
{", ".join(SENTIMENTS)}

Rules:
- Pick the strongest applicable sentiment
- Be conservative
- Focus on emotional tone, not intent

Respond ONLY in valid JSON:
{{
  "sentiment": "<sentiment>",
  "confidence": 0.0-1.0,
  "escalation_risk": true | false,
  "reason": "<short explanation>"
}}
"""

# Temporary stub for local testing
def mock_llm(prompt):
    text = prompt.lower()

    if "angry" in text or "furious" in text:
        return {
            "sentiment": "angry",
            "confidence": 0.9,
            "escalation_risk": True,
            "reason": "Strong negative language detected"
        }

    if "frustrat" in text or "annoy" in text:
        return {
            "sentiment": "frustrated",
            "confidence": 0.85,
            "escalation_risk": True,
            "reason": "Customer expressed frustration"
        }

    if "confus" in text or "not sure" in text:
        return {
            "sentiment": "confused",
            "confidence": 0.7,
            "escalation_risk": False,
            "reason": "Customer appears uncertain"
        }

    return {
        "sentiment": "calm",
        "confidence": 0.6,
        "escalation_risk": False,
        "reason": "No strong emotional signals"
    }

if __name__ == "__main__":
    data = aggregate()
    prompt = build_prompt(data["conversation"])
    result = mock_llm(prompt)

    print(json.dumps(result, indent=2))
