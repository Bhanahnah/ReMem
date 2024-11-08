class Message:
    def __init__(self, text):
        self.text = text
        self.metadata = vars(Metadata())

class Metadata:
    def __init__(self):
        self.api = "api_flask_python_hello-world"
        self.branch = "basic-role-based-access-control"


def get_public_message():
    return Message(
        "This is a public message."
    )


def get_protected_message():
    return Message(
        "This is a protected message."
    )


def get_admin_message():
    return Message(
        "This is an admin message."
    )
