import json
from .context import load_context
from .aggregate_transcript import aggregate

HUMAN_KEYWORDS = [
    "talk to a human",
    "real person",
    "agent",
    "manager",
    "supervisor"
]

def detect_human_request(conversation):
    text = " ".join(item["text"].lower() for item in conversation)
    return any(keyword in text for keyword in HUMAN_KEYWORDS)


def should_escalate(call_id: str):
    context = load_context(call_id)
    data = aggregate()
    conversation = data["conversation"]

    reasons = []

    # Rule 1: Angry sentiment
    if context["sentiment"] == "angry":
        reasons.append("Customer is angry")

    # Rule 2: Frustrated + refund
    if (
        context["sentiment"] == "frustrated"
        and context["intent"] == "refund"
    ):
        reasons.append("Frustrated refund request")

    # Rule 3: Context already flagged
    if context["escalation"]:
        reasons.append("Escalation previously flagged")

    # Rule 4: Explicit human request
    if detect_human_request(conversation):
        reasons.append("Customer requested a human agent")

    return {
        "escalate": len(reasons) > 0,
        "reasons": reasons
    }


if __name__ == "__main__":
    result = should_escalate("call_123")
    print(json.dumps(result, indent=2))
