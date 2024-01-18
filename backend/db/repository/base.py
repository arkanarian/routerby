from typing import Generic, List, Optional, Type, TypeVar

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.db.base_class import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class BaseRepository(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """
    Base repository with basic methods.
    """

    def __init__(self, db: AsyncSession, model: Type[ModelType]) -> None:
        """
        CRUD object with default methods to Create, Read, Update, Delete (CRUD).

        :param db: A SQLAlchemy Session object.
        :param model: A SQLAlchemy model class.
        """
        self.db = db
        self.model = model
    
    async def update(self, obj: ModelType, **update_data) -> ModelType:
        """
        Update model object by fields from `update_data` arguments.
        """
        obj_data = jsonable_encoder(obj)
        for field in obj_data:
            if field in update_data:
                setattr(obj, field, update_data[field])
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj
    
    async def filter(self, **kwargs) -> List[ModelType]:
        stmt = select(self.model).filter_by(**kwargs)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_one(self, **kwargs) -> Optional[ModelType]:
        stmt = select(self.model).filter_by(**kwargs)
        result = await self.db.execute(stmt)
        return result.scalars().one()

    async def get_one_or_none(self, **kwargs) -> Optional[ModelType]:
        stmt = select(self.model).filter_by(**kwargs)
        result = await self.db.execute(stmt)
        return result.scalars().one_or_none()

    async def get_all(self, limit: int, offset: int) -> List[ModelType]:
        """
        Return all objects from specific db table.
        """
        stmt = select(self.model).offset(offset).limit(limit)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get(self, obj_id: str) -> Optional[ModelType]:
        """
        Get object by `id` field.
        """
        stmt = select(self.model).where(self.model.id == obj_id)
        result = await self.db.execute(stmt)
        return result.scalars().first()
    
    async def create(self, obj_create: CreateSchemaType) -> ModelType:
        """
        Create new object in db table.
        """
        obj = self.model(**obj_create.model_dump())
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def update_obj(self, obj: ModelType, obj_update: UpdateSchemaType) -> ModelType:
        """
        Update model object by fields from `obj_update` schema.
        """
        obj_data = jsonable_encoder(obj)
        update_data = obj_update.model_dump(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(obj, field, update_data[field])
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    async def delete(self, obj_id: int) -> Optional[ModelType]:
        """
        Delete object.
        """
        stmt = delete(self.model).where(self.model.id == obj_id).returning(self.model.id)
        result = await self.db.execute(stmt)
        await self.db.commit()
        return result.scalars().first()