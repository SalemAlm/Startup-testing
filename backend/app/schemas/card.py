from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CardLimitsSchema(BaseModel):
    per_transaction: Optional[float] = None
    daily: Optional[float] = None
    weekly: Optional[float] = None
    monthly: Optional[float] = None
    total: Optional[float] = None

class CardRestrictionsSchema(BaseModel):
    allowed_categories: List[str] = []
    allow_travel: bool = False

class CardCreate(BaseModel):
    cardholder_name: str
    user_id: Optional[str] = None
    balance: float
    limits: CardLimitsSchema
    restrictions: CardRestrictionsSchema

class CardUpdate(BaseModel):
    balance: Optional[float] = None
    status: Optional[str] = None
    limits: Optional[CardLimitsSchema] = None
    restrictions: Optional[CardRestrictionsSchema] = None

class CardResponse(BaseModel):
    id: str
    card_number: str
    cardholder_name: str
    expiry_date: str
    cvv: str
    balance: float
    status: str
    user_id: str
    user_name: str
    limits: CardLimitsSchema
    restrictions: CardRestrictionsSchema
    created_at: datetime
    last_used: Optional[datetime] = None

    class Config:
        from_attributes = True
