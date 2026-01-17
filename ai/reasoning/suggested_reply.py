import json
from .aggregate_transcript import aggregate
from .context import load_context

def build_prompt(conversation, context):
    convo_text = "\n".join(
        f"- {item['text']}" for item in conversation[-5:]
    )

    return f"""
You are an AI customer support assistant helping a HUMAN agent.

Conversation:
{convo_text}

Known context:
- Intent: {context['intent']}
- Sentiment: {context['sentiment']}
- Escalation: {context['escalation']}

Task:
Suggest ONE next reply for the support agent.

Rules:
- Be concise
- Match emotional tone
- Do NOT promise refunds unless policy allows
- Sound human, empathetic, and professional

Respond ONLY in JSON:
{{
  "reply": "<text>",
  "tone": "<empathetic | neutral | apologetic>",
  "confidence": 0.0-1.0
}}
"""


# Mock LLM for now
def mock_llm(prompt):
    p = prompt.lower()

    if "refund" in p:
        return {
            "reply": "I’m really sorry about the delay. Let me check your order details and see how we can resolve this for you.",
            "tone": "empathetic",
            "confidence": 0.9
        }

    return {
        "reply": "Sure, I can help with that. Could you please share a bit more detail?",
        "tone": "neutral",
        "confidence": 0.7
    }


if __name__ == "__main__":
    data = aggregate()
    ctx = load_context("call_123")

    prompt = build_prompt(data["conversation"], ctx)
    result = mock_llm(prompt)

    print(json.dumps(result, indent=2))
