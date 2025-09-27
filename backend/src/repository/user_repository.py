from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import mapped_column
from sqlalchemy import String
from models import Category

from src.repository.base.LogicalDeleteDao import IdSchema, BaseCreateDTO, BaseUpdateDTO, BaseReadDTO, BasicDao

class UserSchema(IdSchema):
    __tablename__ = "users"
    username = mapped_column(String, unique=True, index=True)
    password = mapped_column(String, unique=True, index=True)
    salt = mapped_column(String)
    
class UserCreate(BaseCreateDTO):
    username: str
    password: str
    salt: str
    
class UserUpdate(BaseUpdateDTO):
    pass

class UserRead(BaseReadDTO):
    id: int
    username: str
    salt: str
    
class UserRepository(
    BasicDao[UserSchema, UserCreate, UserUpdate, UserRead]
):
    def __init__(self, db: AsyncSession):
        super().__init__(db, UserSchema, UserRead)
        
    async def find_by_username(self, username: str) -> UserRead | None:
        """
        指定されたusernameのレコードを検索します。
        
        :param username: 検索するusername
        :return: 該当するUserのレコード、存在しない場合はNone
        """
        results = await self._find_by_fields(username=username)
        return results[0] if results else None
    
    