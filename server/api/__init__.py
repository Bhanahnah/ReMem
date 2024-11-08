##########################################
# External Modules
##########################################

import logging

from flask import Flask
from flask_cors import CORS
from flask_talisman import Talisman

from api import exception_views
from api.messages import messages_views
from api.messages import routes_userinfo
from api.security.auth0_service import auth0_service

from common.utils import safe_get_env_var


def create_app():

    # Configure pymongo logging
    logging.basicConfig(level=logging.DEBUG)  # Set logging level to DEBUG
    logger = logging.getLogger('pymongo')  # Get the pymongo logger
    logger.setLevel(logging.DEBUG)  # Set the level for pymongo logs

    ##########################################
    # Environment Variables
    ##########################################
    client_origin_url = safe_get_env_var("CLIENT_ORIGIN_URL")
    auth0_audience = safe_get_env_var("AUTH0_AUDIENCE")
    auth0_domain = safe_get_env_var("AUTH0_DOMAIN")

    ##########################################
    # Flask App Instance
    ##########################################

    app = Flask(__name__, instance_relative_config=True)

    # Enable Flask's built-in debug logging
    app.config['DEBUG'] = True
    app.config['PROPAGATE_EXCEPTIONS'] = True

    ##########################################
    # HTTP Security Headers
    ##########################################

    csp = {
        'default-src': ['\'self\''],
        'frame-ancestors': ['\'none\'']
    }

    Talisman(
        app,
        force_https=False,
        frame_options='DENY',
        content_security_policy=csp,
        referrer_policy='no-referrer',
        x_xss_protection=False,
        x_content_type_options=True
    )

    auth0_service.initialize(auth0_domain, auth0_audience)

    @app.after_request
    def add_headers(response):
        response.headers['X-XSS-Protection'] = '0'
        response.headers['Cache-Control'] = 'no-store, max-age=0, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        response.headers['Content-Type'] = 'application/json; charset=utf-8'
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        return response

    ##########################################
    # CORS
    ##########################################

    # Allow cross-origin requests from the client on the "/api" route
    # TODO: Does this mean server won't be on domain re-mem.com?
    # TODO: DONT ALLOW * CORS ORIGINS (find origin url of watsonx assistant)
    CORS(
        app,
        resources={r"/api/*": {"origins": [client_origin_url, "*"]}},
        allow_headers=["Authorization", "Content-Type"],
        methods=["GET", "POST"],
        max_age=86400
    )

    ##########################################
    # Blueprint Registration
    ##########################################

    app.register_blueprint(messages_views.bp)
    app.register_blueprint(exception_views.bp)
    app.register_blueprint(routes_userinfo.bp)

    return app
