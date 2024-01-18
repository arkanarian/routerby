from datetime import datetime
import enum

from sqlalchemy import Boolean, CheckConstraint, DateTime, Float, ForeignKey, String, Enum, Text, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.sqltypes import Integer
from sqlalchemy.sql.sqltypes import Enum

from backend.db.base_class import Base

# if TYPE_CHECKING:
#     from backend.db.models.transaction import Transaction
# else:
#     Transaction = "Transaction"



class Place(Base):
    __tablename__ = "places"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(length=255), nullable=False, index=True)
    alias: Mapped[str] = mapped_column(String(length=255), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    address: Mapped[str] = mapped_column(String(length=255), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    time_open: Mapped[datetime] = mapped_column(Time, nullable=False)
    time_close: Mapped[datetime.time] = mapped_column(Time, nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=0)
    views_amount: Mapped[int] = mapped_column(Integer, default=0)
    liked_amount: Mapped[int] = mapped_column(Integer, default=0)
    ratings_amount: Mapped[int] = mapped_column(Integer, default=0)
    rating_yandex: Mapped[float] = mapped_column(Float, default=0)

    city_id: Mapped[int] = mapped_column(Integer, ForeignKey("cities.id"))
    district_id: Mapped[int] = mapped_column(Integer, ForeignKey("districts.id"))
    place_type_id: Mapped[int] = mapped_column(Integer, ForeignKey("place_types.id"))

    city: Mapped["City"] = relationship("City", back_populates="places")
    district: Mapped["District"] = relationship("District", back_populates="places")
    place_type: Mapped["PlaceType"] = relationship("PlaceType", back_populates="places")
    images: Mapped[list["PlaceImage"]] = relationship("PlaceImage", back_populates="place")

    # credit_payments = relationship(
    #     "Credit",
    #     secondary=CreditCardAssociation,
    #     back_populates="card_payments",
    # )
    # transactions_from: Mapped[List[Transaction]] = relationship("Transaction", back_populates="card_from", lazy="selectin")
    # transactions_to: Mapped[List[Transaction]] = relationship("Transaction", back_populates="card_to", lazy="selectin")
