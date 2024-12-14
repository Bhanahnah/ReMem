from datetime import datetime
import sys

from flask import Blueprint, g, request, jsonify, Response
from pydantic import ValidationError, BaseModel

from api.mongodb.base import db_users_global as db
from api.mongodb.models import *
from api.security.guards import (
    authorization_guard,
    permissions_guard,
    admin_messages_permissions
)

bp_name = 'api-input'
bp_url_prefix = '/api/input'
bp = Blueprint(bp_name, __name__, url_prefix=bp_url_prefix)

## Response model
class TextInputResponse(BaseModel):
    wascreated: bool
    userid: Annotated[str, BeforeValidator(str)] | None
    desc: str

    def resp(self, status=200):
        return jsonify(self.model_dump()), status

@bp.route("/textinput", methods=["POST"])
def textinput():
    print(request.origin)
    try:
        data = TextInputModel(**request.json, created_dt = datetime.now())
        print(data.get_str())

        user = db.get_user_info(GetUserModel(id=data.userid))
        if not user:
            return TextInputResponse(userid=data.userid,
                                    wascreated=False,
                                    desc="Invalid/unkown user id").resp(400)

        # Truncate to max 3000 characters
        maxlen = 3000
        data.data_rawtext = data.data_rawtext[:3000] + '...' if \
                                len(data.data_rawtext) > maxlen else data.data_rawtext
        db.create_text_input(data)
        return TextInputResponse(userid=data.userid,
                                    wascreated=True,
                                    desc=f"Successfully created, truncated to {maxlen} chars").resp()
    except Exception as error:
        print(error)
        return jsonify(str(error)), 400

@bp.route("/getalltext", methods=["GET"])
@authorization_guard
def getall_textinput():
    print(g.get("access_token").get("sub"))



# @bp.route("/getstream", methods=["GET"])
# @authorization_guard
# def getall_textinput():
#     print(g.get("access_token"), g.get("access_token").get("permissions"))
#     print(request.origin)

#     { "$match" : { "userid" : data.userid } }

