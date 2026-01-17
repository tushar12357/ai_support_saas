import json
from pathlib import Path
from datetime import datetime

STATE_DIR = Path("state")
STATE_DIR.mkdir(exist_ok=True)

def _state_file(call_id: str):
    return STATE_DIR / f"{call_id}.json"


def load_context(call_id: str):
    file = _state_file(call_id)
    if not file.exists():
        return {
            "call_id": call_id,
            "intent": None,
            "sentiment": None,
            "escalation": False,
            "summary": [],
            "last_updated": None
        }

    with open(file) as f:
        return json.load(f)


def save_context(context: dict):
    context["last_updated"] = datetime.utcnow().isoformat()
    with open(_state_file(context["call_id"]), "w") as f:
        json.dump(context, f, indent=2)


def update_context(
    call_id: str,
    intent_result: dict | None = None,
    sentiment_result: dict | None = None
):
    ctx = load_context(call_id)

    if intent_result:
        # Update intent only if confidence is strong
        if (
            ctx["intent"] is None
            or intent_result["confidence"] > 0.75
        ):
            ctx["intent"] = intent_result["intent"]
            ctx["summary"].append(
                f"Customer intent detected: {intent_result['intent']}"
            )

    if sentiment_result:
        ctx["sentiment"] = sentiment_result["sentiment"]
        if sentiment_result.get("escalation_risk"):
            ctx["escalation"] = True

    save_context(ctx)
    return ctx


if __name__ == "__main__":
    # Manual test
    updated = update_context(
        call_id="call_123",
        intent_result={
            "intent": "refund",
            "confidence": 0.9
        },
        sentiment_result={
            "sentiment": "frustrated",
            "escalation_risk": True
        }
    )

    print(json.dumps(updated, indent=2))
