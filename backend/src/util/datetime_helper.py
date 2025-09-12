from datetime import datetime
from zoneinfo import ZoneInfo


def get_now():
    return datetime.now(ZoneInfo("Asia/Tokyo"))