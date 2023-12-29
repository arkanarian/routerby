from datetime import datetime
import enum

from sqlalchemy import Boolean, CheckConstraint, DateTime, Float, ForeignKey, String, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.sqltypes import Integer
from sqlalchemy.sql.sqltypes import Enum

from backend.db.base_class import Base

# if TYPE_CHECKING:
#     from backend.db.models.transaction import Transaction
# else:
#     Transaction = "Transaction"



class Card(Base):
    __tablename__ = "card"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(length=255), nullable=False, index=True)
    alias: Mapped[str] = mapped_column(String(length=255), nullable=False, index=True)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    address: Mapped[str] = mapped_column(String(length=255))
    description: Mapped[str] = mapped_column(Text)
    time_open: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    time_close: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    total_rating: Mapped[float] = mapped_column(Float, default=0)
    ratings_amount: Mapped[int] = mapped_column(Integer, default=0)
    rating_yandex: Mapped[float] = mapped_column(Float, default=0)

    city_id: Mapped[int] = mapped_column(Integer, ForeignKey("city.id"))
    district_id: Mapped[int] = mapped_column(Integer, ForeignKey("district.id"))
    type_id: Mapped[int] = mapped_column(Integer, ForeignKey("place_type.id"))

    # credit_payments = relationship(
    #     "Credit",
    #     secondary=CreditCardAssociation,
    #     back_populates="card_payments",
    # )
    # transactions_from: Mapped[List[Transaction]] = relationship("Transaction", back_populates="card_from", lazy="selectin")
    # transactions_to: Mapped[List[Transaction]] = relationship("Transaction", back_populates="card_to", lazy="selectin")
