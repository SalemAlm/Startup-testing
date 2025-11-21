from fastapi import APIRouter, HTTPException, status
from app.schemas.user import UserLogin, Token, UserResponse
from app.core.database import get_database
from app.core.security import verify_password, create_access_token
from datetime import timedelta
from app.core.config import settings

router = APIRouter()

@router.post("/login", response_model=dict)
async def login(credentials: UserLogin):
    """Login endpoint"""
    db = get_database()

    # Find user by email
    user = await db.users.find_one({"email": credentials.email})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Verify password
    if not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user["_id"]), "email": user["email"]},
        expires_delta=access_token_expires
    )

    return {
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "companyId": user["company_id"],
            "createdAt": user["created_at"].isoformat()
        },
        "token": access_token
    }

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = None):
    """Get current user"""
    return current_user
