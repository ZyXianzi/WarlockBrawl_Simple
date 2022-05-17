from django.http import JsonResponse

def get_status(request):
    user = request.user
    if user.is_authenticated:
        return JsonResponse({
            'result': "login",
            'username': user.username
        })
    return JsonResponse({
        'result': "logout",
    })