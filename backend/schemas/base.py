import datetime

from pydantic import BaseModel


class BaseSchema(BaseModel):
    date_updated: datetime.datetime
    date_created: datetime.datetime
    is_active: bool
