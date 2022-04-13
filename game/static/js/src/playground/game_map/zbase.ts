import {WarlockGamePlayground} from "../zbase"
import { Grid } from "./grid/zbase";

export class GameMap extends WarlockGameObject {
    playground: WarlockGamePlayground;
    $canvas: JQuery<HTMLCanvasElement>;
    ctx: CanvasRenderingContext2D;
    ceil_width: number;
    // 调试用变量
    nx: number;
    ny: Number;
    grids: Grid[] = [];

    constructor(playground: WarlockGamePlayground) {
        super();  // 调用基类的构造函数
        this.playground = playground;
        this.$canvas = $(`<canvas class="warlock_game_playground_game_map" tabindex=0></canvas>`);
        this.ctx = <CanvasRenderingContext2D>this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);

        let width = this.playground.virtual_map_width;
        let height = this.playground.virtual_map_height;
        this.ceil_width = height * 0.05;
        this.nx = Math.ceil(width / this.ceil_width);
        this.ny = Math.ceil(height / this.ceil_width);
    }

    start() {
        this.generate_grid();
        this.$canvas.trigger("focus");
    }

    resize() {  // 动态修改地图大小
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    // 显示地图网格，调试用
    generate_grid() {
        this.grids = [];
        for(let i = 0; i < this.nx; i++) {
            for(let j = 0; j < this.ny; j++) {
                this.grids.push(new Grid(this.playground, this.ctx, i, j, this.ceil_width, "rgb(123, 123, 123, 0.5)"));
            }
        }
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
