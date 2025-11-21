from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime
from bson import ObjectId

class ApprovalRequest(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    type: str  # card_creation, limit_increase, expense
    requested_by: str
    requested_by_name: str
    status: str = "pending"  # pending, approved, rejected
    data: Any
    reason: Optional[str] = None
    approved_by: Optional[str] = None
    approved_by_name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
