from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId

class Receipt(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    transaction_id: str
    file_name: str
    file_url: str
    file_size: int
    uploaded_by: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
