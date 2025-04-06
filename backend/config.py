from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

# 画面に表示するカテゴリの数
PAGE_SIZE = 3

class Settings(BaseSettings):
    secret_key: str
    sqlalchemy_database_url: str

    model_config = SettingsConfigDict(env_file=".env")

@lru_cache()
def get_settings():
    return Settings()
