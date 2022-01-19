from django.db import models
from django.contrib.auth.models import User

class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Player表扩充自User表，User删除时，Player一起删
    photo = models.URLField(max_length=256, blank=True)  # 头像
    openid = models.CharField(default="", max_length=50, blank=True, null=True)  # 记录用户openid（对接一键登录）
    
    def __str__(self):  # 设置表上显示的字符串
        return str(self.user)