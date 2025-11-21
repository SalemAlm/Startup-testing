from fastapi import APIRouter, Depends
from app.core.database import get_database
from app.core.deps import get_current_user
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/stats")
async def get_dashboard_stats(
    current_user: dict = Depends(get_current_user)
):
    """Get dashboard statistics"""
    db = get_database()

    # Get cards count
    if current_user["role"] in ["admin", "finance"]:
        total_cards = await db.cards.count_documents({})
        active_cards = await db.cards.count_documents({"status": "active"})
    else:
        total_cards = await db.cards.count_documents({"user_id": current_user["id"]})
        active_cards = await db.cards.count_documents({"user_id": current_user["id"], "status": "active"})

    # Get transactions
    month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    # Get recent transactions
    transactions_cursor = db.transactions.find().sort("created_at", -1).limit(5)
    recent_transactions = await transactions_cursor.to_list(length=5)

    # Calculate spending
    all_transactions = await db.transactions.find().to_list(length=None)
    total_spend = sum(t["amount"] for t in all_transactions if t["status"] == "completed")

    monthly_transactions = [t for t in all_transactions if t["created_at"] >= month_start]
    monthly_spend = sum(t["amount"] for t in monthly_transactions if t["status"] == "completed")

    # Pending approvals
    pending_approvals = await db.approvals.count_documents({"status": "pending"})

    return {
        "totalCards": total_cards,
        "activeCards": active_cards,
        "totalSpend": total_spend,
        "monthlySpend": monthly_spend,
        "pendingApprovals": pending_approvals,
        "recentTransactions": [
            {
                "id": str(t["_id"]),
                "cardId": t["card_id"],
                "amount": t["amount"],
                "currency": t["currency"],
                "merchant": t["merchant"],
                "category": t["category"],
                "description": t["description"],
                "status": t["status"],
                "receiptId": t.get("receipt_id"),
                "createdAt": t["created_at"].isoformat()
            }
            for t in recent_transactions
        ]
    }
