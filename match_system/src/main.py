#! /usr/bin/env python3

import glob
import sys
sys.path.insert(0, glob.glob('../../')[0])  # 添加django包目录
from match_server.match_service import Match

from thrift.server import TServer
from thrift.protocol import TBinaryProtocol
from thrift.transport import TTransport
from thrift.transport import TSocket


from queue import Queue  # Python3同步队列
from time import sleep
from threading import Thread

from Warlock.asgi import channel_layer
from asgiref.sync import async_to_sync
from django.core.cache import cache

queue = Queue()  # 定义消息队列

class Player:
    def __init__(self, score, uuid, username, photo, player_x, player_y, channel_name):
        self.score = score
        self.uuid = uuid
        self.username = username
        self.photo = photo
        self.player_x = player_x
        self.player_y = player_y
        self.channel_name = channel_name
        self.waiting_time = 0  # 等待时间

class Pool:
    def __init__(self):
        self.players = []

    def add_player(self, player):
        
        self.players.append(player)

    def check_match(self, a, b): 
        if a.username == b.username:
            return False
        dt = abs(a.score - b.score)
        a_max_dif = a.waiting_time * 50
        b_max_dif = b.waiting_time * 50
        return dt <= a_max_dif and dt <= b_max_dif

    def match_success(self, ps):
        print("Match Success: %s %s %s" % (ps[0].username, ps[1].username, ps[2].username))
        room_name = "room-%s-%s-%s" % (ps[0].uuid, ps[1].uuid, ps[2].uuid)
        players = []
        for p in ps:
            async_to_sync(channel_layer.group_add)(room_name, p.channel_name)
            players.append({
                'uuid': p.uuid,
                'username': p.username,
                'photo': p.photo,
                'player_x': p.player_x,
                'player_y': p.player_y,
                'hp': 100,
            })
        cache.set(room_name, players, 3600)  # 有效时间1小时
        for p in ps:
            async_to_sync(channel_layer.group_send)(  # 调用server里的进程
                room_name,
                {
                    'type': "group_send_event",
                    'event': "create_player",
                    'uuid': p.uuid,
                    'username': p.username,
                    'photo': p.photo,
                    'player_x': p.player_x,
                    'player_y': p.player_y,
                }
            )

    def increase_waiting_time(self):
        for player in self.players: 
            player.waiting_time += 1

    def match(self):
        while len(self.players) >= 3:
            self.players = sorted(self.players, key=lambda p: p.score)
            flag = False
            for i in range(len(self.players) - 2):
                a, b, c = self.players[i], self.players[i + 1], self.players[i + 2]
                if self.check_match(a, b) and self.check_match(b, c) and self.check_match(a, c):
                    self.match_success([a, b, c])
                    self.players = self.players[:i] + self.players[i + 3:]
                    flag = True
                    break
            if not flag:
                break

        self.increase_waiting_time()

class MatchHandler:
   def add_player(self, score, uuid, username, photo, player_x, player_y,channel_name):
       print("Add Player: %s %d" % (username, score))
       player = Player(score, uuid, username, photo, player_x, player_y, channel_name)
       queue.put(player)
       return 0  # 必须要加上 return 0

def get_player_from_queue():
    try:
        return queue.get_nowait()
    except:
        return None

def worker():
    pool = Pool()
    while True:
        player = get_player_from_queue()
        if player:
            pool.add_player(player)
        else:
            pool.match()
            sleep(1)

if __name__ == '__main__':
    handler = MatchHandler()
    processor = Match.Processor(handler)
    transport = TSocket.TServerSocket(host='127.0.0.1', port=9090)
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()

    server = TServer.TThreadedServer(  # 高并行server
        processor, transport, tfactory, pfactory)

    Thread(target=worker, daemon=True).start()  # daemon表示守护进程（杀主线程的时候会一起被杀）

    print('Starting the server...')
    server.serve()
    print('done.')