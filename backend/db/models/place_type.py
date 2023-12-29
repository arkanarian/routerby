from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from backend.db.base_class import Base


class PlaceType(Base):
    __tablename__ = "place_type"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(length=255), nullable=False, index=True)
    alias: Mapped[str] = mapped_column(String(length=255), nullable=False, index=True)
