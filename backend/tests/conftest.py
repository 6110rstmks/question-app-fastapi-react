# tests/conftest.py
import os

os.environ["SECRET_KEY"] = "test_secret"
os.environ["SQLALCHEMY_DATABASE_URL"] = "sqlite:///:memory:"
