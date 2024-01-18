from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from backend.db.dependencies import get_db
from backend.db.models.place import Place
from backend.db.repository.base import BaseRepository
from backend.schemas.place import PlaceEntity, PlaceInCreate, PlaceInUpdate

class PlaceRepository(BaseRepository[Place, PlaceInCreate, PlaceInUpdate]):
    """
    Repository to manipulate with place
    """
    async def get_all_joined(self, limit: int, offset: int):
        stmt = (
        select(self.model).filter_by(is_active=True)
        .options(
            joinedload(self.model.city),
            joinedload(self.model.district),
            joinedload(self.model.place_type),
            joinedload(self.model.images)
        ).limit(limit).offset(offset)
        )
        result = await self.db.execute(stmt)
        return result.scalars().unique().all()
    
    async def select_in_ids(self, *ids) -> list[PlaceEntity]:
        stmt = (
        select(self.model).filter(self.model.id.in_(*ids))
        .options(
            joinedload(self.model.city),
            joinedload(self.model.district),
            joinedload(self.model.place_type),
            joinedload(self.model.images)
        )
        )
        result = await self.db.execute(stmt)
        return result.scalars().unique().all()

    async def get_by_alias(self, alias) -> PlaceEntity:
        stmt = (
        select(self.model).filter_by(alias=alias)
        .options(
            joinedload(self.model.city),
            joinedload(self.model.district),
            joinedload(self.model.place_type),
            joinedload(self.model.images)
        )
        )
        result = await self.db.execute(stmt)
        return result.scalars().unique().first() # FIXME: change to one_or_none()


def get_place_repository(session: AsyncSession = Depends(get_db)) -> PlaceRepository:
    return PlaceRepository(db=session, model=Place)
