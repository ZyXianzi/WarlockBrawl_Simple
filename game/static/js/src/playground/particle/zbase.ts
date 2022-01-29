import { WarlockGamePlayground } from "../zbase";
import { GameMap } from "../game_map/zbase";

export class Particle extends WarlockGameObject {
    playground: WarlockGamePlayground;
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    radius: number;
    vx: number;
    vy: number;
    color: string;
    speed: number;
    move_length: number;
    friction: number;
    eps: number;

    constructor(playground: WarlockGamePlayground, x: number, y: number, radius: number, vx: number, vy: number, color: string, speed: number, move_length: number) {
        super();
        this.playground = playground;
        this.ctx = (<GameMap>this.playground.game_map).ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.friction = 0.9;
        this.eps = 0.01;
    }

    start() {

    }

    update() {
        if (this.move_length < this.eps || this.speed < this.eps) {
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000)
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.move_length -= moved;
        this.render();
    }

    render() {
        let scale = this.playground.scale;
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}