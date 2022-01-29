import { WarlockGamePlayground } from "../zbase";
import { GameMap } from "../game_map/zbase";

export class NoticeBoard extends WarlockGameObject {
    playground: WarlockGamePlayground;
    ctx: CanvasRenderingContext2D;
    text: string;

    constructor(playground: WarlockGamePlayground) {
        super();

        this.playground = playground;
        this.ctx = (<GameMap>this.playground.game_map).ctx;
        this.text = "已就绪0人";
    }

    start() {

    }

    update() {
        this.render();
    }

    write(text: string) {
        this.text = text;
    }

    render() {
        this.ctx.font = "20px serif";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.text, this.playground.width / 2, 20);
    }
}