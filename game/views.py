from django.http import HttpResponse

def index(request):
    line1 = '<h1 style="text-align: center">术士之战</h1>'
    line2 = '<h1 style="text-align: center"><a href="./play/">进入游戏界面</a></h1>'
    return HttpResponse(line1 + line2)

def play(request):
    line1 = '<h1 style="text-align: center">游戏界面</h1>'
    line2 = '<h1 style="text-align: center"><a href="../">返回上级页面</a></h1>'
    return HttpResponse(line1 + line2)
