import { Player } from "../../player/zbase";
import { WarlockGamePlayground } from "../../zbase";
import { MultiPlayerSocket } from "../../socket/multiplayer/zbase";
import { GameMap } from "../../game_map/zbase";

export class FireBall extends WarlockGameObject {
    playground: WarlockGamePlayground;
    player: Player;
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    speed: number;
    move_length: number;
    damage: number;
    eps: number;

    constructor(playground: WarlockGamePlayground, player: Player, x: number, y: number, vx: number, vy: number, radius: number, color: string, speed: number, move_length: number, damage: number) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = (<GameMap>this.playground.game_map).ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.01;
    }

    start() {

    }

    update() {
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }

        this.update_move();

        if (this.player.character !== "enemy") {
            this.update_attack();
        }

        this.render();
    }

    update_move() {
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
    }

    update_attack() {
        for (let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
                break;
            }
        }
    }

    get_dist(x1: number, y1: number, x2: number, y2: number) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // 判断物体是否碰撞
    is_collision(player: Player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if (distance < this.radius + player.radius) {
            return true;
        }
        return false;
    }

    // 火球击中玩家
    attack(player: Player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);  // 记录攻击角度
        player.is_attacked(angle, this.damage);

        if (this.playground.mode === "multi mode") {
            (<MultiPlayerSocket>this.playground.mps).send_attack(player.uuid, player.x, player.y, angle, this.damage, this.uuid);
        }

        this.destroy();
    }

    render() {
        let scale = this.playground.scale;
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destroy() {
        let fireballs = this.player.fireballs;
        for (let i = 0; i < fireballs.length; i ++) {
            if (fireballs[i] === this) {
                fireballs.splice(i, 1);
                break;
            }
        }
    }
}