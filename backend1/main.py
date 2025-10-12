# main.py
from fastapi import FastAPI, HTTPException, Request, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import os
from dotenv import load_dotenv
import time

# Import routers
from routes import admin, agriculture, environment, healthcare, auth

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Multi-Domain AI Platform API",
    version="1.0.0",
    description="EcoHealth Sentinel - Emergency Prediction & Access Control API"
)

# =====================
# CORS Configuration - FIXED
# =====================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://localhost:5000",
        "https://ecohealth-sentinel.vercel.app",
        "https://ecohealth-sentinel.netlify.app",
        "https://ecohealth-sentinel.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# =====================
# Logging Middleware
# =====================
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests and responses"""
    start_time = time.time()
    
    # Log request
    print(f"📥 Incoming: {request.method} {request.url.path}")
    
    response = await call_next(request)
    
    # Log response
    process_time = time.time() - start_time
    print(f"📤 Response: {response.status_code} | Time: {process_time:.4f}s")
    
    return response

# =====================
# MongoDB Connection
# =====================
MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb+srv://aiadmin:mypassword123@cluster0.n9mmmbt.mongodb.net"
)
DB_NAME = os.getenv("DB_NAME", "ai_platform_db")

@app.on_event("startup")
async def startup_db_client():
    """Connect to MongoDB when app starts"""
    try:
        app.mongodb_client = AsyncIOMotorClient(MONGO_URI)
        app.mongodb = app.mongodb_client[DB_NAME]
        
        # Test connection
        await app.mongodb_client.server_info()
        print("✅ Connected to MongoDB!")
        print(f"📊 Database: {DB_NAME}")
        
        # Initialize collections if they don't exist
        collections = await app.mongodb.list_collection_names()
        print(f"📁 Collections: {', '.join(collections) if collections else 'None yet'}")
        
    except Exception as e:
        print(f"❌ MongoDB connection error: {e}")
        print("🔧 Check your connection string and network access")

@app.on_event("shutdown")
async def shutdown_db_client():
    """Disconnect MongoDB on app shutdown"""
    app.mongodb_client.close()
    print("🛑 Disconnected from MongoDB!")

# =====================
# Pydantic Models for Access Control
# =====================
class User(BaseModel):
    name: str
    email: EmailStr
    role: str
    domain: str
    status: str = "active"
    permissions: List[str] = []
    lastAccess: Optional[str] = None
    lastLogin: Optional[datetime] = None
    ipAddress: Optional[str] = None
    loginCount: int = 0
    failedAttempts: int = 0
    location: Optional[str] = None
    phone: Optional[str] = None
    createdAt: datetime = datetime.now()

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    domain: Optional[str] = None
    status: Optional[str] = None
    permissions: Optional[List[str]] = None

class SecurityLog(BaseModel):
    type: str  # success, warning, danger, info
    action: str
    user: str
    time: str
    timestamp: datetime = datetime.now()
    ip: str
    details: Optional[str] = None
    domain: Optional[str] = None

# =====================
# Access Control Routes
# =====================

@app.get("/api/admin/access-control/users", tags=["Access Control"])
async def get_users(
    role: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None
):
    """Get all users with optional filtering"""
    try:
        collection = app.mongodb["users"]
        
        # Build query
        query = {}
        if role and role != "all":
            query["domain"] = role
        if status and status != "all":
            query["status"] = status
        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"email": {"$regex": search, "$options": "i"}}
            ]
        
        users = await collection.find(query).sort("createdAt", -1).to_list(100)
        
        # Convert ObjectId to string
        for user in users:
            user["_id"] = str(user["_id"])
            if "createdAt" in user:
                user["createdAt"] = user["createdAt"].isoformat()
            if "lastLogin" in user and user["lastLogin"]:
                user["lastLogin"] = user["lastLogin"].isoformat()
        
        return {"success": True, "users": users}
    
    except Exception as e:
        print(f"❌ Error fetching users: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/access-control/logs", tags=["Access Control"])
async def get_security_logs():
    """Get security logs"""
    try:
        collection = app.mongodb["security_logs"]
        
        logs = await collection.find().sort("timestamp", -1).limit(50).to_list(50)
        
        # Convert ObjectId to string
        for log in logs:
            log["_id"] = str(log["_id"])
            if "timestamp" in log:
                log["timestamp"] = log["timestamp"].isoformat()
        
        return {"success": True, "logs": logs}
    
    except Exception as e:
        print(f"❌ Error fetching logs: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/access-control/users", tags=["Access Control"])
async def create_user(user: User, request: Request):
    """Create a new user"""
    try:
        collection = app.mongodb["users"]
        
        # Check if email already exists
        existing_user = await collection.find_one({"email": user.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already exists")
        
        user_dict = user.dict()
        result = await collection.insert_one(user_dict)
        
        # Create security log
        log_collection = app.mongodb["security_logs"]
        log = SecurityLog(
            type="success",
            action="New user created",
            user="Admin",
            time=datetime.now().strftime("%H:%M:%S"),
            ip=request.client.host,
            details=f"Created user: {user.name}",
            domain=user.domain
        )
        await log_collection.insert_one(log.dict())
        
        user_dict["_id"] = str(result.inserted_id)
        return {"success": True, "user": user_dict}
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error creating user: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/api/admin/access-control/users/{user_id}/status", tags=["Access Control"])
async def update_user_status(
    user_id: str,
    status: str = Body(..., embed=True),
    request: Request = None
):
    """Update user status (activate/suspend)"""
    try:
        from bson import ObjectId
        collection = app.mongodb["users"]
        
        result = await collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"status": status}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        user = await collection.find_one({"_id": ObjectId(user_id)})
        
        # Create security log
        log_collection = app.mongodb["security_logs"]
        log = SecurityLog(
            type="success" if status == "active" else "danger",
            action=f"User {'activated' if status == 'active' else 'suspended'}",
            user="Admin",
            time=datetime.now().strftime("%H:%M:%S"),
            ip=request.client.host if request else "system",
            details=f"{user['name']} status changed to {status}",
            domain=user.get("domain", "N/A")
        )
        await log_collection.insert_one(log.dict())
        
        user["_id"] = str(user["_id"])
        return {"success": True, "user": user}
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error updating status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/api/admin/access-control/users/{user_id}", tags=["Access Control"])
async def update_user(user_id: str, user_update: UserUpdate):
    """Update user details"""
    try:
        from bson import ObjectId
        collection = app.mongodb["users"]
        
        # Only update fields that are provided
        update_data = {k: v for k, v in user_update.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        result = await collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        user = await collection.find_one({"_id": ObjectId(user_id)})
        user["_id"] = str(user["_id"])
        
        return {"success": True, "user": user}
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error updating user: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/access-control/users/{user_id}", tags=["Access Control"])
async def delete_user(user_id: str, request: Request):
    """Delete a user"""
    try:
        from bson import ObjectId
        collection = app.mongodb["users"]
        
        user = await collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        await collection.delete_one({"_id": ObjectId(user_id)})
        
        # Create security log
        log_collection = app.mongodb["security_logs"]
        log = SecurityLog(
            type="danger",
            action="User deleted",
            user="Admin",
            time=datetime.now().strftime("%H:%M:%S"),
            ip=request.client.host,
            details=f"Deleted user: {user['name']}",
            domain=user.get("domain", "N/A")
        )
        await log_collection.insert_one(log.dict())
        
        return {"success": True, "message": "User deleted successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error deleting user: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# =====================
# Include Existing Routers
# =====================
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(agriculture.router, prefix="/api/agriculture", tags=["Agriculture"])
app.include_router(environment.router, prefix="/api/environment", tags=["Environment"])
app.include_router(healthcare.router, prefix="/api/healthcare", tags=["Healthcare"])

# =====================
# Root & Health Routes
# =====================
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "message": "Multi-Domain AI Platform API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "health": "/api/health",
            "users": "/api/admin/access-control/users",
            "logs": "/api/admin/access-control/logs"
        }
    }

@app.get("/api/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    try:
        # Check MongoDB connection
        await app.mongodb_client.server_info()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "database": db_status,
        "timestamp": datetime.now().isoformat()
    }

# =====================
# Run the App
# =====================
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    
    print("\n" + "="*60)
    print("🚀 EcoHealth Sentinel FastAPI Server Starting...")
    print("="*60)
    print(f"📡 HTTP Server: http://localhost:{port}")
    print(f"📚 Docs: http://localhost:{port}/docs")
    print(f"🗄️  MongoDB: {DB_NAME}")
    print("="*60 + "\n")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
