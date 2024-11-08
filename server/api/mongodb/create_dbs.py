"""Given an existing MondoDB cluster, create or check exist the needed databases,
collections, schema validations, etc for ReMem.

Author: Bhavana Jonnalagadda
"""
import os
from datetime import datetime
from bson import ObjectId

from dotenv import load_dotenv
from pymongo import MongoClient, database

from base import UsersCRUD
from models import *


def create_check_user_dbs(dbcrud: UsersCRUD):
    dbs = dbcrud.list_dbs()

    if "user_data" not in dbs:
        print("Couldn't find db `user_data`. Creating:")
        db = database.Database(client, "user_data")
        coll = "text_input"
        if not (coll in db.list_collection_names()):
            print(f"Couldn't find collection {coll}. Creating:")
            db[coll].insert_one(TextInputModel(
                    userid=ObjectId(), data_dt=datetime.now(), data_rawtext="Fake data to populate db", created_dt=datetime.now()
                ).model_dump(exclude_none=True))

    if "user_info" not in dbs:
        print("Couldn't find db `user_info`. Creating:")
        db = database.Database(client, "user_info")
        coll = "users"
        if not (coll in db.list_collection_names()):
            print(f"Couldn't find collection {coll}. Creating:")
            db[coll].insert_one(UserInfoModel(
                    name="test69", email="test69@gmail.com", created_dt=datetime.now()
                ).model_dump(exclude_none=True))

    dbcrud.list_dbs()



if __name__ == "__main__":
    create_check_user_dbs(UsersCRUD())
