from django.urls import path, include
from game.views.index import index

# 设置game的分路由
urlpatterns = [
    path("", index, name="index"),
    path("menu/", include("game.urls.menu.index")),
    path("playground/", include("game.urls.playground.index")),
    path("settings/", include("game.urls.settings.index")),
    path("calculator/", include("game.urls.calculator.index")),
]