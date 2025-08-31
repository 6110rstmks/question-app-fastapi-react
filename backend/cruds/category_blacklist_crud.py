from backend.models import CategoryBlacklist
from sqlalchemy.orm import Session

def find_all_category_blacklist(session: Session):
    return session.query(CategoryBlacklist).all()