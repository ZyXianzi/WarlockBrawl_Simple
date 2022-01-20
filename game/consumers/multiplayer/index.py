from channels.generic.websocket import AsyncWebsocketConsumer
import json

class MultiPlayer(AsyncWebsocketConsumer):
    async def connect(self):  # 创建连接
        await self.accept()
        print('accept')

        self.room_name = "room"
        await self.channel_layer.group_add(self.room_name, self.channel_name)  # 将连接添加到组里

    async def disconnect(self, close_code):  # 断开连接
        print('disconnect')
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive(self, text_data):  # 接收前端向后端发送的请求
        data = json.loads(text_data)
        print(data)
