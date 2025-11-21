from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from app.schemas.card import CardCreate, CardResponse, CardUpdate
from app.core.database import get_database
from app.core.deps import get_current_user, get_current_admin
from bson import ObjectId
import random
from datetime import datetime, timedelta

router = APIRouter()

def generate_card_number() -> str:
    """Generate a random 16-digit card number"""
    return "".join([str(random.randint(0, 9)) for _ in range(16)])

def generate_cvv() -> str:
    """Generate a random 3-digit CVV"""
    return "".join([str(random.randint(0, 9)) for _ in range(3)])

def generate_expiry_date() -> str:
    """Generate expiry date (3 years from now)"""
    expiry = datetime.now() + timedelta(days=365 * 3)
    return expiry.strftime("%m/%y")

@router.post("", response_model=CardResponse, status_code=status.HTTP_201_CREATED)
async def create_card(
    card_data: CardCreate,
    current_user: dict = Depends(get_current_admin)
):
    """Create a new virtual card (admin only)"""
    db = get_database()

    # Generate card details
    card_number = generate_card_number()
    cvv = generate_cvv()
    expiry_date = generate_expiry_date()

    card = {
        "card_number": card_number,
        "cardholder_name": card_data.cardholder_name,
        "expiry_date": expiry_date,
        "cvv": cvv,
        "balance": card_data.balance,
        "status": "active",
        "user_id": card_data.user_id or current_user["id"],
        "user_name": card_data.cardholder_name,
        "limits": card_data.limits.model_dump(),
        "restrictions": card_data.restrictions.model_dump(),
        "created_at": datetime.utcnow(),
        "last_used": None
    }

    result = await db.cards.insert_one(card)
    card["_id"] = result.inserted_id

    return {
        "id": str(card["_id"]),
        "cardNumber": card["card_number"],
        "cardholderName": card["cardholder_name"],
        "expiryDate": card["expiry_date"],
        "cvv": card["cvv"],
        "balance": card["balance"],
        "status": card["status"],
        "userId": card["user_id"],
        "userName": card["user_name"],
        "limits": card["limits"],
        "restrictions": card["restrictions"],
        "createdAt": card["created_at"].isoformat(),
        "lastUsed": card["last_used"]
    }

@router.get("", response_model=List[CardResponse])
async def get_cards(
    current_user: dict = Depends(get_current_user)
):
    """Get all cards (admin sees all, members see only their cards)"""
    db = get_database()

    # Admin and finance can see all cards
    if current_user["role"] in ["admin", "finance"]:
        cursor = db.cards.find()
    else:
        # Regular members see only their cards
        cursor = db.cards.find({"user_id": current_user["id"]})

    cards = await cursor.to_list(length=100)

    return [
        {
            "id": str(card["_id"]),
            "cardNumber": card["card_number"],
            "cardholderName": card["cardholder_name"],
            "expiryDate": card["expiry_date"],
            "cvv": card["cvv"],
            "balance": card["balance"],
            "status": card["status"],
            "userId": card["user_id"],
            "userName": card["user_name"],
            "limits": card["limits"],
            "restrictions": card["restrictions"],
            "createdAt": card["created_at"].isoformat(),
            "lastUsed": card["last_used"].isoformat() if card.get("last_used") else None
        }
        for card in cards
    ]

@router.get("/{card_id}", response_model=CardResponse)
async def get_card(
    card_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific card"""
    db = get_database()

    if not ObjectId.is_valid(card_id):
        raise HTTPException(status_code=400, detail="Invalid card ID")

    card = await db.cards.find_one({"_id": ObjectId(card_id)})

    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    # Check permissions
    if current_user["role"] not in ["admin", "finance"] and card["user_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    return {
        "id": str(card["_id"]),
        "cardNumber": card["card_number"],
        "cardholderName": card["cardholder_name"],
        "expiryDate": card["expiry_date"],
        "cvv": card["cvv"],
        "balance": card["balance"],
        "status": card["status"],
        "userId": card["user_id"],
        "userName": card["user_name"],
        "limits": card["limits"],
        "restrictions": card["restrictions"],
        "createdAt": card["created_at"].isoformat(),
        "lastUsed": card["last_used"].isoformat() if card.get("last_used") else None
    }

@router.patch("/{card_id}/freeze")
async def freeze_card(
    card_id: str,
    current_user: dict = Depends(get_current_admin)
):
    """Freeze a card (admin only)"""
    db = get_database()

    if not ObjectId.is_valid(card_id):
        raise HTTPException(status_code=400, detail="Invalid card ID")

    result = await db.cards.update_one(
        {"_id": ObjectId(card_id)},
        {"$set": {"status": "frozen"}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Card not found")

    return {"message": "Card frozen successfully"}

@router.patch("/{card_id}/unfreeze")
async def unfreeze_card(
    card_id: str,
    current_user: dict = Depends(get_current_admin)
):
    """Unfreeze a card (admin only)"""
    db = get_database()

    if not ObjectId.is_valid(card_id):
        raise HTTPException(status_code=400, detail="Invalid card ID")

    result = await db.cards.update_one(
        {"_id": ObjectId(card_id)},
        {"$set": {"status": "active"}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Card not found")

    return {"message": "Card unfrozen successfully"}

@router.delete("/{card_id}")
async def delete_card(
    card_id: str,
    current_user: dict = Depends(get_current_admin)
):
    """Delete a card (admin only)"""
    db = get_database()

    if not ObjectId.is_valid(card_id):
        raise HTTPException(status_code=400, detail="Invalid card ID")

    result = await db.cards.update_one(
        {"_id": ObjectId(card_id)},
        {"$set": {"status": "cancelled"}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Card not found")

    return {"message": "Card cancelled successfully"}
