from datetime import datetime

from flask import Blueprint, g, request, jsonify, Response
from pydantic import ValidationError, BaseModel

from api.mongodb.base import db_users_global as db
from api.mongodb.models import *
from api.security.guards import (
    authorization_guard,
    permissions_guard,
    admin_messages_permissions
)

bp_name = 'api-userinfo'
bp_url_prefix = '/api/userinfo'
bp = Blueprint(bp_name, __name__, url_prefix=bp_url_prefix)

## Reseponse models
class GetCreateResponse(UserInfoModel):
    wascreated: bool
    desc: str

    def resp(self, status=200):
        return Response(self.get(), mimetype="application/json", status=status)

# @bp.route("/public")
# def public():
#     return vars(get_public_message())


@bp.route("/getcreate", methods=["POST"])
@authorization_guard
def protected():
    print(g.get("access_token"), g.get("access_token").get("permissions"))
    try:
        print(jsonify(**request.json))
        data = UserInfoModel(**request.json, created_dt = datetime.now())
        # Have id already, fetching info
        if data.id:
            db_data = db.get_user_info(UserInfoModel(id=data.id, authid=data.authid))
            created=False
            if not db_data:
                return GetCreateResponse(**data.get(),
                                     wascreated=created,
                                     desc="FAILED!!! WHY???").resp(400)
        # Do not have id, create and/or get it
        else:
            success, created, userid = db.create_update_user_info(data)
            if not success:
                return GetCreateResponse(**data.get(),
                                        wascreated=created,
                                        desc="FAILED 2!!! WHY???").resp(400)
            db_data = db.get_user_info(UserInfoModel(id=userid, authid=data.authid))
            if not db_data:
                return GetCreateResponse(**data.get(),
                                     wascreated=created,
                                     desc="FAILED!!! WHY???").resp(400)
        return GetCreateResponse(**db_data.get(),
                                 wascreated=created,
                                 desc="Successfully created/updated/retrieved"
                                 ).resp(200)
    except Exception as error:
        return jsonify(error.with_traceback()), 400


# @bp.route("/admin")
# @authorization_guard
# @permissions_guard([admin_messages_permissions.read])
# def admin():
#     return vars(get_admin_message())
