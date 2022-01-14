from django.http import HttpResponse

def index(request):
    line1 = '<h1 style="text-align: center">My first Website !</h1>'
    return HttpResponse(line1)