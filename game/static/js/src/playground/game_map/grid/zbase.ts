import { WarlockGamePlayground } from "../../zbase";

export class Grid extends WarlockGameObject {
    playground: WarlockGamePlayground;
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    ceil_width: number;
    color: string;
    start_x: number;
    start_y: number;

    constructor(playground: WarlockGamePlayground, ctx: CanvasRenderingContext2D, i: number, j: number, ceil_width: number, color: string) {
        super();
        this.playground = playground;
        this.ctx = ctx;
        this.x = i;
        this.y = j;
        this.ceil_width = ceil_width;
        this.color = color;
        this.start_x = this.x * this.ceil_width;
        this.start_y = this.y * this.ceil_width;
    }

    start() {

    }

    update() {
        this.render();
    }

    render() {
        let scale = this.playground.scale;
        let ctx_x = this.start_x - <number>this.playground.cx;
        let ctx_y = this.start_y - <number>this.playground.cy;
        let cx = ctx_x + this.ceil_width * 0.5;  // grid中心坐标
        let cy = ctx_y + this.ceil_width * 0.5;

        // 处于屏幕范围外，则不渲染
        if (cx * scale < -0.2 * this.playground.width ||
            cx * scale > 1.2 * this.playground.width ||
            cy * scale < -0.2 * this.playground.height ||
            cy * scale > 1.2 * this.playground.height) {
            return;
        }

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.ceil_width * 0.05 * scale;
        this.ctx.strokeStyle = this.color;
        this.ctx.rect(ctx_x * scale, ctx_y * scale, this.ceil_width * scale, this.ceil_width * scale);
        this.ctx.stroke();
        this.ctx.restore();
    }
}