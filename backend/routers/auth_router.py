from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette import status
from cruds import auth_crud as auth_cruds
from schemas.auth import UserCreate, UserResponse, Token, UserSignIn
from database import get_db


router = APIRouter(prefix="/auth", tags=["Auth"])

DbDependency = Annotated[Session, Depends(get_db)]
FormDependency = Annotated[OAuth2PasswordRequestForm, Depends()]

@router.post(
    "/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
async def create_user(db: DbDependency, user_create: UserCreate):
    if auth_cruds.check_user_already_exists(db, user_create):
        raise HTTPException(status_code=400, detail="User already exists")
    return auth_cruds.create_user(db, user_create)

# 使用していない。
@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK
)
async def read_users_me(current_user: UserResponse = Depends(auth_cruds.get_current_user)):
    return current_user


@router.post("/login", status_code=status.HTTP_200_OK, response_model=Token)
async def login(db: DbDependency, user_signin: UserSignIn):
    user = auth_cruds.authenticate_user(db, user_signin.username, user_signin.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    token = auth_cruds.create_access_token(
        user.username, user.id, timedelta(minutes=20)
    )
    return {"access_token": token, "token_type": "bearer"}


