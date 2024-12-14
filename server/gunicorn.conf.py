import os
import gunicorn.http.wsgi
from functools import wraps
from dotenv import load_dotenv
from common.utils import safe_get_env_var

load_dotenv()

wsgi_app = "api.wsgi:app"
bind = f"0.0.0.0:{safe_get_env_var('PORT')}"

isprod = safe_get_env_var('FLASK_ENV') == "production"
if isprod:
    print("NOTE: Using production setup")

# Path to SSL certificates (use your actual paths here)
currdir = os.path.dirname(os.path.realpath(__file__))
proddir = "/etc/ssl/"
certfile = os.path.join(os.path.join(proddir, "certs") if isprod else currdir, 'server.crt')
keyfile = os.path.join(os.path.join(proddir, "private") if isprod else currdir, 'server.key')

# Enable SSL
secure_bind = f"0.0.0.0:{safe_get_env_var('PORT')}"  # For HTTPS
ssl_options = {
    'certfile': certfile,
    'keyfile': keyfile,
    'ssl_version': 'TLSv1_2',
}


def wrap_default_headers(func):
    @wraps(func)
    def default_headers(*args, **kwargs):
        return [header for header in func(*args, **kwargs) if not header.startswith('Server: ')]
    return default_headers

gunicorn.http.wsgi.Response.default_headers = wrap_default_headers(gunicorn.http.wsgi.Response.default_headers)

