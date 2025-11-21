from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId

class Transaction(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    card_id: str
    amount: float
    currency: str = "USD"
    merchant: str
    category: str
    description: str
    status: str = "completed"  # pending, completed, declined
    receipt_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
