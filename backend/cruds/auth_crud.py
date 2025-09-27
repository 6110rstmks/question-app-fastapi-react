import hashlib
import base64
import os
from sqlalchemy.orm import Session
from schemas import auth
from models import User
from sqlalchemy import select
from fastapi import Depends, HTTPException, status
from fastapi.requests import Request
from schemas.auth import UserResponse
from database import get_db
from fastapi.responses import JSONResponse
from typing import Optional


def create_user(
    db: Session, 
    user_create: auth.UserCreate
) -> list[UserResponse]:
    salt = base64.b64encode(os.urandom(32))
    hashed_password = hashlib.pbkdf2_hmac(
        "sha256",
        user_create.password.encode(),
        salt,
        1000
    ).hex()

    new_user = User(
        username=user_create.username,
        password=hashed_password,
        salt=salt.decode()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def check_user_already_exists(
    db: Session, 
    user_create: auth.UserCreate
) -> bool:
    query = select(User).where(User.username == user_create.username)
    user = db.execute(query).scalars().first()
    if user:
        return True
    return False

# フロントからきたパスワードをハッシュ化して、ユーザーを認証する
def authenticate_user(
    db: Session, 
    username: str, 
    password: str,
    request: Request
) -> Optional[JSONResponse]:

    user = db.query(User).filter(User.username == username).first()
    if not user:
        return None
    
    hashed_password = hashlib.pbkdf2_hmac(
        "sha256", 
        password.encode(), 
        user.salt.encode(), 
        1000
    ).hex()
    
    if user.password != hashed_password:
        raise HTTPException(status_code=401, detail="パスワードが間違っています。")

    request.session["user"] = {
        "id": user.id,
        "username": user.username,
    }
    return JSONResponse({"message": "Login successful"})


async def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> UserResponse:
    user_session = request.session.get("user")
    if not user_session:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    
    user_id = user_session.get("id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return UserResponse.from_orm(user)
