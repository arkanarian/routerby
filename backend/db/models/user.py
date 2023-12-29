import enum
from typing import TYPE_CHECKING

from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy import String, Boolean, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.db.base_class import Base

# if TYPE_CHECKING:
#     from backend.db.models.account import Account  # noqa
# else:
#     Account = "Account"

class RolesEnum(str, enum.Enum):
    ADMIN = "ADMIN"
    MANAGER = "MANAGER"
    USER = "USER"


class User(SQLAlchemyBaseUserTableUUID, Base):
    """Represents a user entity."""

    username: Mapped[str] = mapped_column(String(length=50), nullable=False, unique=True, index=True)
    role = mapped_column(Enum(RolesEnum), default=RolesEnum.USER, nullable=False)
    profile_photo: Mapped[str] = mapped_column(String(length=255), nullable=True)
    is_subscriber: Mapped[bool] = mapped_column(Boolean, server_default="false", nullable=False)
    # first_name: Mapped[str] = mapped_column(String(length=50))
    # second_name: Mapped[str] = mapped_column(String(length=50))
