from datetime import datetime
import enum

from sqlalchemy import Boolean, CheckConstraint, DateTime, Float, ForeignKey, String, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.sqltypes import Integer
from sqlalchemy.sql.sqltypes import Enum

from backend.db.base_class import Base


class City(Base):
    __tablename__ = "cities"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(length=255), nullable=False, index=True)
    alias: Mapped[str] = mapped_column(String(length=255), nullable=False, index=True)
    district_id: Mapped[int] = mapped_column(Integer, ForeignKey("districts.id"))

    places: Mapped["Place"] = relationship("Place", back_populates="city")
