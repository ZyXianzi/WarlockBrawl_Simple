import { Player } from "../player/zbase";
import { MultiPlayerSocket } from "../socket/multiplayer/zbase";
import { WarlockGamePlayground } from "../zbase";
import { GameMap } from "../game_map/zbase";

export class MiniMap extends WarlockGameObject {
    playground: WarlockGamePlayground;
    $canvas: JQuery<HTMLCanvasElement> = $(`<canvas class="mini-map"></canvas>`);
    ctx = <CanvasRenderingContext2D>this.$canvas[0].getContext('2d');
    background_color = "rgba(0, 0, 0, 0.3)";
    bright_color = "rgba(255, 255, 255, 0.5)";

    players: Player[];
    pos_x: number;
    pos_y: number;
    width: number;
    height: number;
    real_map_width: number;

    lock = false;
    drag = false;

    margin_right?: number;
    margin_bottom?: number;
    rect_x1?: number;
    rect_y1?: number;

    constructor(playground: WarlockGamePlayground) {
        super();
        this.playground = playground;
        this.players = this.playground.players;
        this.pos_x = this.playground.width - this.playground.height * 0.3;
        this.pos_y = this.playground.height * 0.7;
        this.width = this.playground.height * 0.3;
        this.height = this.width;
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;

        this.playground.$playground.append(this.$canvas);
        this.real_map_width = this.playground.virtual_map_width;

        this.lock = false;
        this.drag = false;
    }

    start() {
        this.add_listening_events();
    }

    resize() {
        this.pos_x = this.playground.width - this.playground.height * 0.3;
        this.pos_y = this.playground.height * 0.7;
        this.width = this.playground.height * 0.3;
        this.height = this.width;
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;

        this.margin_right = (<number>this.playground.$playground.width() - this.playground.width) / 2;
        this.margin_bottom = (<number>this.playground.$playground.height() - this.playground.height) / 2;
        this.$canvas.css({
            "position": "absolute",
            "right": this.margin_right,
            "bottom": this.margin_bottom
        });
    }

    add_listening_events() {
        let outer = this;
        this.$canvas.on("contextmenu", () => {
            return false;
        });

        this.$canvas.on("mousedown", e => {
            if (outer.playground.mode === "single mode" || (outer.playground.mode === "multi mode" && outer.playground.state === "fighting")) {

                const rect = outer.ctx.canvas.getBoundingClientRect();
                let ctx_x = e.clientX - rect.left, ctx_y = e.clientY - rect.top; // 小地图上的位置
                let tx = ctx_x / outer.width * outer.playground.virtual_map_width, ty = ctx_y / outer.height * outer.playground.virtual_map_height; // 大地图上的位置

                if (e.which === 1) { // 左键，定位屏幕中心
                    outer.lock = true;
                    outer.drag = false;

                    outer.playground.focus_player = undefined;
                    outer.playground.get_center(tx, ty);
                    // (rect_x1, rect_y1)为小地图上框框的左上角的坐标（非相对坐标）
                    outer.rect_x1 = ctx_x - (outer.playground.width / 2 / outer.playground.scale / outer.playground.virtual_map_width) * outer.width;
                    outer.rect_y1 = ctx_y - (outer.playground.height / 2 / outer.playground.scale / outer.playground.virtual_map_height) * outer.height;
                }
                else if (e.which === 3) { // 右键，移动过去
                    let player = outer.playground.players[0];
                    if (player.character === "me") {
                        // FIXME: 右键小地图移动时移动路径渲染不正确
                        player.tx = tx, player,ty = ty;
                        player.move_to(tx, ty);
                        if (outer.playground.mode === "multi mode") {
                            (<MultiPlayerSocket>outer.playground.mps).send_move_to(tx, ty);
                        }
                    }
                }
            }
            (<GameMap>outer.playground.game_map).$canvas.trigger("focus");
        });

        this.$canvas.on("mousemove", e => {
            if (outer.playground.mode === "single mode" || (outer.playground.mode === "multi mode" && outer.playground.state === "fighting")) {
                const rect = outer.ctx.canvas.getBoundingClientRect();
                let ctx_x = e.clientX - rect.left, ctx_y = e.clientY - rect.top; // 小地图上的位置
                let tx = ctx_x / outer.width * outer.playground.virtual_map_width, ty = ctx_y / outer.height * outer.playground.virtual_map_height; // 大地图上的位置
                if (e.which === 1) {
                    if (outer.lock) {
                        outer.drag = true;
                        outer.playground.focus_player = undefined;
                        outer.playground.get_center(tx, ty);
                        outer.rect_x1 = ctx_x - (outer.playground.width / 2 / outer.playground.scale / outer.playground.virtual_map_width) * outer.width;
                        outer.rect_y1 = ctx_y - (outer.playground.height / 2 / outer.playground.scale / outer.playground.virtual_map_height) * outer.height;
                    }
                }
            }
            (<GameMap>outer.playground.game_map).$canvas.trigger("focus");
        });

        this.$canvas.on("mouseup", () => {
            if (outer.playground.mode === "single mode" || (outer.playground.mode === "multi mode" && outer.playground.state === "fighting")) {
                if (outer.lock) outer.lock = false;
                if (outer.drag) outer.drag = false;
                let player = outer.playground.players[0];
                if (player.character === "me") {
                    outer.playground.focus_player = player;
                    outer.playground.get_center(player.x, player.y);
                    this.resize();
                }
            }
            (<GameMap>outer.playground.game_map).$canvas.trigger("focus");
        });
    }

    update() {
        this.render();
    }

    render() {
        let scale = this.playground.scale;
        this.ctx.clearRect(0, 0, this.width, this.height); // 不加这行的话小地图背景会变黑
        this.ctx.fillStyle = this.background_color;
        this.ctx.fillRect(0, 0, this.width, this.height);
        if (this.playground.focus_player) {
            this.rect_x1 = (this.playground.focus_player.x - this.playground.width / 2 / scale) / this.real_map_width * this.width;
            this.rect_y1 = (this.playground.focus_player.y - this.playground.height / 2 / scale) / this.real_map_width * this.height;
        }
        let w = this.playground.width / scale / this.real_map_width * this.width;
        let h = this.playground.height / scale / this.real_map_width * this.height;
        this.ctx.save();
        this.ctx.strokeStyle = this.bright_color;
        this.ctx.setLineDash([15, 5]);
        this.ctx.lineWidth = Math.ceil(3 * scale / 1080);

        this.rect_x1 = Math.min(<number>this.rect_x1, this.width - w);
        this.rect_x1 = Math.max(this.rect_x1, 0);

        this.rect_y1 = Math.min(<number>this.rect_y1, this.height - h);
        this.rect_y1 = Math.max(this.rect_y1, 0);


        this.ctx.strokeRect(this.rect_x1, this.rect_y1, w, h);
        this.ctx.restore();
        for (let i = 0; i < this.players.length; i++) {
            let obj = this.players[i];
            let x = obj.x / this.real_map_width * this.width, y = obj.y / this.real_map_width * this.height;
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.width * 0.025, 0, Math.PI * 2, false);
            this.ctx.fillStyle = obj.color;
            this.ctx.fill();
        }
    }
}