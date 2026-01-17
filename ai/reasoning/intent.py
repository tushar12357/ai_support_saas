import json

INTENTS = [
    "refund",
    "cancellation",
    "order_status",
    "technical_issue",
    "complaint",
    "general_query"
]

def build_prompt(conversation):
    convo_text = "\n".join(
        f"- {item['text']}" for item in conversation
    )

    return f"""
You are an AI customer support system.

Conversation so far:
{convo_text}

Task:
Identify the customer's PRIMARY intent from the following list:
{", ".join(INTENTS)}

Rules:
- Pick only ONE intent
- Be conservative
- If unclear, choose general_query

Respond ONLY in valid JSON:
{{
  "intent": "<intent>",
  "confidence": 0.0-1.0,
  "reason": "<short explanation>"
}}
"""

# Temporary stub — will be replaced by real LLM
def mock_llm(prompt):
    if "refund" in prompt.lower():
        return {
            "intent": "refund",
            "confidence": 0.9,
            "reason": "Customer explicitly requested a refund"
        }

    return {
        "intent": "general_query",
        "confidence": 0.6,
        "reason": "No clear intent detected"
    }

if __name__ == "__main__":
    from .aggregate_transcript import aggregate

    data = aggregate()
    prompt = build_prompt(data["conversation"])

    result = mock_llm(prompt)
    print(json.dumps(result, indent=2))
