from fastapi import APIRouter
from app.api.endpoints import auth, cards, dashboard

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(cards.router, prefix="/cards", tags=["Cards"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
