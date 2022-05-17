from django.urls import path, re_path
from game.views.calculator.login import signin
from game.views.calculator.logout import signout
from game.views.calculator.register import register
from game.views.calculator.get_status import get_status
from game.views.calculator.index import index

urlpatterns = [
    path("login/", signin, name="calculator_login"),
    path("logout/", signout, name="calculator_logout"),
    path("register/", register, name="calculator_register"),
    path("get_status/", get_status, name="calculator_get_status"),
    re_path(r".*", index, name="calculator_index"),
]