"""The Pydantic validation schemas for the MongoDB databases/collections.

Author: Bhavana Jonnalagadda
"""
from typing import Annotated, Any, Optional, List
from datetime import datetime

from bson import ObjectId
# from pydantic_core import core_schema

from pydantic import BaseModel, Field, ConfigDict, EmailStr
# from pydantic.json_schema import JsonSchemaValue
from pydantic.functional_validators import BeforeValidator

# Represents an ObjectId field in the database.
# It will be represented as a `str` on the model so that it can be serialized to JSON.
# TODO: figure out how to represent/validate as ObjectId not str???
PyObjectId = Annotated[str, BeforeValidator(str)]

# class ObjectIdPydanticAnnotation:
#     """Def for the ObjectId property of every model in MongoDB collections (why need this?)"""
#     @classmethod
#     def validate_object_id(cls, v: Any, handler) -> ObjectId:
#         if isinstance(v, ObjectId):
#             return v

#         s = handler(v)
#         if ObjectId.is_valid(s):
#             return ObjectId(s)
#         else:
#             raise ValueError("Invalid ObjectId")

#     @classmethod
#     def __get_pydantic_core_schema__(cls, source_type, _handler) -> core_schema.CoreSchema:
#         assert source_type is ObjectId
#         return core_schema.no_info_wrap_validator_function(
#             cls.validate_object_id,
#             core_schema.str_schema(),
#             serialization=core_schema.to_string_ser_schema(),
#         )

#     @classmethod
#     def __get_pydantic_json_schema__(cls, core_schema, handler) -> JsonSchemaValue:
#         return handler(core_schema.str_schema())


class MongoDBModel(BaseModel):
    # id: Optional[Annotated[ObjectId, ObjectIdPydanticAnnotation]] = Field(alias="_id", default=None)
    # The primary key for the StudentModel, stored as a `str` on the instance.
    # This will be aliased to `_id` when sent to MongoDB,
    # but provided as `id` in the API requests and responses.
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )

    def get(self, exclude=None):
        return self.model_dump(exclude_none=True, exclude=exclude)


class UserInfoModel(MongoDBModel):
    authid: str
    name: str = None
    email: EmailStr = None
    created_dt: datetime = None

class UserInfoCollection(BaseModel):
    """
    A container holding a list of `StudentModel` instances.

    This exists because providing a top-level array in a JSON response can be a [vulnerability](https://haacked.com/archive/2009/06/25/json-hijacking.aspx/)
    """

    users: List[UserInfoModel]


class TextInputModel(MongoDBModel):
    userid: PyObjectId
    created_dt: datetime
    data_dt: datetime = None
    data_rawtext: str = None
    data_entities: Optional[dict] = None


class TextInputCollection(BaseModel):
    text_input: List[TextInputModel]
