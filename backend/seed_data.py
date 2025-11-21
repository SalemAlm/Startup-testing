"""
Seed script to create initial demo data
Run with: python seed_data.py
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from app.core.security import get_password_hash

MONGODB_URL = "mongodb://localhost:27017"
DB_NAME = "corporate_cards"

async def seed_database():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DB_NAME]

    print("🌱 Seeding database...")

    # Create demo users
    users = [
        {
            "_id": "admin001",
            "email": "admin@company.com",
            "name": "Admin User",
            "password_hash": get_password_hash("admin123"),
            "role": "admin",
            "company_id": "company001",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": "finance001",
            "email": "finance@company.com",
            "name": "Finance Manager",
            "password_hash": get_password_hash("finance123"),
            "role": "finance",
            "company_id": "company001",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "_id": "member001",
            "email": "member@company.com",
            "name": "Team Member",
            "password_hash": get_password_hash("member123"),
            "role": "member",
            "company_id": "company001",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]

    # Clear existing data
    await db.users.delete_many({})
    await db.cards.delete_many({})
    await db.transactions.delete_many({})

    # Insert users
    await db.users.insert_many(users)
    print(f"✅ Created {len(users)} demo users")

    # Create sample transactions for demo
    transactions = [
        {
            "card_id": "demo_card_001",
            "amount": 34.00,
            "currency": "USD",
            "merchant": "Uber",
            "category": "transportation",
            "description": "Ride to office",
            "status": "completed",
            "created_at": datetime.utcnow()
        },
        {
            "card_id": "demo_card_001",
            "amount": 125.50,
            "currency": "USD",
            "merchant": "Hilton Hotel",
            "category": "accommodation",
            "description": "Business travel accommodation",
            "status": "completed",
            "created_at": datetime.utcnow()
        }
    ]

    await db.transactions.insert_many(transactions)
    print(f"✅ Created {len(transactions)} demo transactions")

    print("\n🎉 Database seeded successfully!")
    print("\nDemo credentials:")
    print("  Admin:   admin@company.com / admin123")
    print("  Finance: finance@company.com / finance123")
    print("  Member:  member@company.com / member123")

    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
