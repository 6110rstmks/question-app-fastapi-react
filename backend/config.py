from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from enum import Enum


# 画面に表示するカテゴリの数
PAGE_SIZE = 3

class SolutionStatus(int, Enum):
    Incorrect = 0
    Temporary = 1
    Correct = 2

class Settings(BaseSettings):
    secret_key: str
    sqlalchemy_database_url: str

    model_config = SettingsConfigDict(env_file=".env")

@lru_cache()
def get_settings():
    return Settings()
