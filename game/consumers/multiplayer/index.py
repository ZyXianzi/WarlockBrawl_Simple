from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.conf import settings
from django.core.cache import cache

class MultiPlayer(AsyncWebsocketConsumer):
    async def connect(self):  # 创建连接
        self.room_name = None

        for i in range(1000):
            name = "room_%d" % (i)
            if not cache.has_key(name) or len(cache.get(name)) < settings.ROOM_CAPACITY:
                self.room_name = name
                break

        if not self.room_name:
            return

        await self.accept()
        
        if not cache.has_key(self.room_name):
            cache.set(self.room_name, [], 3600)  # 房间有效期1小时

        for player in cache.get(self.room_name):
            await self.send(text_data=json.dumps({  # 发送消息到前端
                'event': "create_player",
                'uuid': player['uuid'],
                'username': player['username'],
                'photo': player['photo'],
            }))

        await self.channel_layer.group_add(self.room_name, self.channel_name)  # 将连接添加到组里

    async def disconnect(self, close_code):  # 断开连接
        print('disconnect')
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def create_player(self, data):
        players = cache.get(self.room_name)
        players.append({
            'uuid': data['uuid'],
            'username': data['username'],
            'photo': data['photo'],
        })
        cache.set(self.room_name, players, 3600)  # 有效期一小时
        await self.channel_layer.group_send(  # 群发消息
            self.room_name,
            {
                'type': "group_create_player",
                'event': "create_player",
                'uuid': data['uuid'],
                'username': data['username'],
                'photo': data['photo'],
            }
        )

    async def group_create_player(self, data):
        await self.send(text_data=json.dumps(data))  # 发送消息到前端

    async def receive(self, text_data):  # 接收前端向后端发送的请求
        data = json.loads(text_data)
        event = data['event']
        if event == "create_player":
            await self.create_player(data)
