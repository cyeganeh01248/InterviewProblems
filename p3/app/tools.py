from typing import Any
from datetime import datetime


def make_api_response(msg: str, data: Any | None = None) -> dict[str, Any | None]:
    return {
        "msg": msg,
        "data": data,
        "_now": datetime.now(),
    }
