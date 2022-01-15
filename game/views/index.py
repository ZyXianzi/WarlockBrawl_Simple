from django.shortcuts import render

# 接收请求，返回html页面（前端渲染）
def index(request):
    return render(request, "multiends/web.html")