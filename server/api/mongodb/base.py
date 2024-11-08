import datetime
import os

from dotenv import load_dotenv
from pymongo import MongoClient

from api.mongodb.models import *


class UsersCRUD():
    uinfo = "user_info"
    udata = "user_data"

    info_coll = "users"
    data_coll = "text_input"


    def __init__(self, uri=None):
        self.client = self.get_mongo_client(uri=uri)

    @classmethod
    def get_mongo_client(cls, uri=None):
        if not uri:
            # Load config from a .env file:
            load_dotenv()
            MONGODB_URI = os.environ['MONGODB_URI']
        else:
            MONGODB_URI = uri
        # Connect to your MongoDB cluster:
        client = MongoClient(MONGODB_URI)

        return client

    # List all the databases in the cluster
    def list_dbs(self):
        for db_info in self.client.list_database_names():
            print(db_info)
        return self.client.list_database_names()

    def user_info(self):
        return self.client[self.uinfo][self.info_coll]

    def text_input(self):
        return self.client[self.udata][self.data_coll]

    def get_user_info(self, data: UserInfoModel) -> UserInfoModel | None:
        result = self.user_info().find_one(data.get())
        return UserInfoModel.model_validate_json(result) if result else None

    def create_update_user_info(self, data: UserInfoModel) -> tuple[bool, bool, str]:
        created = False
        userid = data.id
        # Id present, means record exists
        if data.id:
            result = self.user_info().find_one({"_id": data.id})
            if not result:
                print(f"Gave User _id for updating but no existing record found!: {data}")
                return False, created, userid
            # Update record
            # Don't ever update the _id or created_dt fields
            res = self.user_info().update_one({"_id": data.id}, {"$set": data.get(exclude=["id", "created_dt"])})
        elif data.authid:
            result = self.user_info().find_one({"authid": data.authid})
            # Create record
            if not result:
                res = self.user_info().insert_one(data.get())
                userid = res.inserted_id
                created = True
            # Update record
            else:
                # Don't ever update the _id or created_dt fields
                res = self.user_info().update_one({"_id": result["_id"]}, {"$set": data.get(exclude=["id", "created_dt"])})
                userid = result["_id"]
        # Cannot perform ops without both ids
        else:
            print(f"Attempting to create/update/get user info without ids!: {data}")
            return False, created, userid

        return res.acknowledged, created, userid


db_users_global = UsersCRUD()


if __name__ == "__main__":
    UsersCRUD().list_dbs()
