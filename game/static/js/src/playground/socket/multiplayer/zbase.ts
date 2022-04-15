import { WarlockGamePlayground } from "../../zbase";
import { Player } from "../../player/zbase";
import { ChatField } from "../../chat_field/zbase";

export class MultiPlayerSocket {
    playground: WarlockGamePlayground;
    ws: WebSocket;
    uuid: string = "";

    constructor(playground: WarlockGamePlayground) {
        this.playground = playground;

        this.ws = new WebSocket("wss://app1186.acapp.acwing.com.cn/wss/multiplayer/");

        this.start();
    }

    start() {
        this.receive();
    }

    receive() {  // 前端接收信息
        let outer = this;
        this.ws.onmessage = function(e) {
            let data = JSON.parse(e.data);
            let uuid = data.uuid;
            if (uuid === outer.uuid) return false;

            let event = data.event;
            if (event === "create_player") {
                outer.receive_create_player(uuid, data.username, data.photo, data.player_x, data.player_y);
            }
            else if (event === "move_to") {
                outer.receive_move_to(uuid, data.tx, data.ty);
            }
            else if (event === "shoot_fireball") {
                outer.receive_shoot_fireball(uuid, data.tx, data.ty, data.ball_uuid);
            }
            else if (event === "attack") {
                outer.receive_attack(uuid, data.attackee_uuid, data.x, data.y, data.angle, data.damage, data.ball_uuid);
            }
            else if (event === "blink") {
                outer.receive_blink(uuid, data.tx, data.ty);
            }
            else if (event === "message") {
                outer.receive_massage(uuid, data.username, data.text);
            }
        }
    }

    send_create_player(username: string, photo: string, player_x: number, player_y: number) {
        console.log(player_x, player_y);
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "create_player",
            'uuid': outer.uuid,
            'username': username,
            'photo': photo,
            'player_x': player_x,
            'player_y': player_y,
        }));
    }

    get_player(uuid: string) {
        let players = this.playground.players;
        for (let i = 0; i < players.length; i ++) {
            let player = players[i];
            if (player.uuid === uuid) {
                return player;
            }
        }
        return null;
    }

    receive_create_player(uuid: string, username: string, photo: string, player_x: number, player_y: number) {
        console.log(player_x, player_y);
        let player = new Player(
            this.playground,
            player_x,
            player_y,
            0.05,
            this.playground.get_random_color(),
            0.15,
            "enemy",
            username,
            photo,
        );

        player.uuid = uuid;
        this.playground.players.push(player);
    }

    send_move_to(tx: number, ty: number) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "move_to",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
        }));
    }

    receive_move_to(uuid: string, tx: number, ty: number) {
        let player = this.get_player(uuid);

        if (player) {
            player.move_to(tx, ty);
        }
    }

    send_shoot_fireball(tx: number, ty: number, ball_uuid: string) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "shoot_fireball",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_shoot_fireball(uuid: string, tx: number, ty: number, ball_uuid: string) {
        let player = this.get_player(uuid);
        if (player) {
            let fireball = player.shoot_fireball(tx, ty);
            fireball.uuid = ball_uuid;
        }
    }

    send_attack(attackee_uuid: string, x: number, y: number, angle: number, damage: number, ball_uuid: string) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "attack",
            'uuid': outer.uuid,
            'attackee_uuid': attackee_uuid,
            'x': x,
            'y': y,
            'angle': angle,
            'damage': damage,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_attack(uuid: string, attackee_uuid: string, x: number, y: number, angle: number, damage: number, ball_uuid: string) {
        let attacker = this.get_player(uuid);
        let attackee = this.get_player(attackee_uuid);
        if (attacker && attackee) {
            attackee.receive_attack(x, y, angle, damage, ball_uuid, attacker);
        }
    }

    send_blink(tx: number, ty: number) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "blink",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
        }));
    }

    receive_blink(uuid: string, tx: number, ty: number) {
        let player = this.get_player(uuid);
        if (player) {
            player.blink(tx, ty);
        }
    }

    send_message(username: string, text: string) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "message",
            'uuid': outer.uuid,
            'username': username,
            'text': text,
        }));
    }

    receive_massage(uuid: string, username: string, text: string) {
        (<ChatField>this.playground.chat_field).add_message(username, text);
    }
}