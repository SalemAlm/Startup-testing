from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId

class Notification(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    user_id: str
    type: str  # transaction, approval, limit_warning, card_status
    title: str
    message: str
    read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
