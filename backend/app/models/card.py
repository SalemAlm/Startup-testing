from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class CardLimits(BaseModel):
    per_transaction: Optional[float] = None
    daily: Optional[float] = None
    weekly: Optional[float] = None
    monthly: Optional[float] = None
    total: Optional[float] = None

class CardRestrictions(BaseModel):
    allowed_categories: List[str] = []
    allow_travel: bool = False

class Card(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    card_number: str
    cardholder_name: str
    expiry_date: str
    cvv: str
    balance: float
    status: str = "active"  # active, frozen, cancelled
    user_id: str
    user_name: str
    limits: CardLimits
    restrictions: CardRestrictions
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_used: Optional[datetime] = None

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
