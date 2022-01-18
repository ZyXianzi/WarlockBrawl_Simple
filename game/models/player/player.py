from django.db import models
from django.contrib.auth.models import User

class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Player表扩充自User表，User删除时，Player一起删
    photo = models.URLField(max_length=256, blank=True)  # 头像
    
    def __str__(self):  # 设置表上显示的字符串
        return str(self.user)