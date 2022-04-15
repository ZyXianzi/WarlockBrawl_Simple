import { WarlockGame } from "../zbase";
import { GameMap } from "./game_map/zbase"
import { Player } from "./player/zbase";
import { NoticeBoard } from "./notice_board/zbase";
import { ScoreBoard } from "./score_board/zbase";
import { ChatField } from "./chat_field/zbase";
import { MultiPlayerSocket } from "./socket/multiplayer/zbase";

export class WarlockGamePlayground {
    root: WarlockGame;
    $playground: JQuery<HTMLElement>;

    width: number = 0;
    height: number = 0;
    scale: number = 0;
    virtual_map_width = 4;
    virtual_map_height = 4;
    cx?: number;
    cy?: number;

    mode?: string;
    state: string = "waiting";

    game_map?: GameMap;
    notice_board?: NoticeBoard;
    score_board?: ScoreBoard;
    chat_field?: ChatField;
    mps?: MultiPlayerSocket;

    players: Player[] = [];
    player_count: number = 0;
    focus_player?: Player;

    constructor(root: WarlockGame) {
        this.root = root;
        this.$playground = $(`<div class="warlock_game_playground"></div>`);

        this.hide();
        this.root.$warlock_game.append(this.$playground);

        this.start();
    }

    get_random_color() {
        let colors = [
            "DeepSkyBlue", "FireBrick", "Pink", "SpringGreen",
            "SlateBlue", "Cyan", "Khahi", "RosyBrown", "Violet",
            "Aquamarine", "CadetBlue", "IndianRed", "OringeRed", "MediumPurple"
        ];
        return colors[Math.floor(Math.random() * 15)];
    }

    create_uuid() {  // 给每个resize函数创建一个唯一编号
        let res = "";
        for (let i = 0; i < 8; i++) {
            let x = Math.floor(Math.random() * 10);
            res += x;
        }
        return res;
    }

    start() {
        let outer = this;
        let uuid = this.create_uuid();
        $(window).on(`resize.$(uuid)`, function () {  // 用户改变窗口大小时触发
            outer.resize();
        });

        if (this.root.AcWingOS) {
            this.root.AcWingOS.api.window.on_close(function () {
                $(window).off(`resize.$(uuid)`);
            });
        }
    }

    resize() {  // 渲染地图为16：9
        this.width = <number>this.$playground.width();
        this.height = <number>this.$playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;  // 设定基准

        if (this.game_map) this.game_map.resize();
    }

    // 获取当前玩家位置在地图上的坐标
    get_center(x: number, y: number) {
        this.cx = Math.max(x - 0.5 * this.width / this.scale, 0);
        this.cx = Math.min(this.cx, this.virtual_map_width - this.width / this.scale);
        this.cy = Math.max(y - 0.5 * this.height / this.scale, 0);
        this.cy = Math.min(this.cy, this.virtual_map_height - 1);
    }

    show(mode: string) {  // 打开playground界面
        let outer = this;
        this.$playground.show();

        // 打开playground界面后再初始化幕布大小
        //this.width = <number>this.$playground.width();
        //this.height = <number>this.$playground.height();
        this.game_map = new GameMap(this);
        // 打开地图后再初始化地图大小

        this.mode = mode;
        //this.state = "waiting";  // waiting -> fighting -> over 状态机
        this.notice_board = new NoticeBoard(this);
        this.score_board = new ScoreBoard(this);
        this.player_count = 0;

        this.resize();

        // 记录玩家生成位置
        let player_x = Math.random() * this.virtual_map_width;
        let player_y = Math.random() * this.virtual_map_height;
        this.players.push(new Player(this, player_x, player_y, 0.05, "white", 0.15, "me", this.root.settings.username, this.root.settings.photo))

        // 将视角锁定至玩家
        this.get_center(this.players[0].x, this.players[0].y);
        this.focus_player = this.players[0];

        if (mode === "single mode") {
            for (let i = 0; i < 2; i++) {
                // 在随机位置生成AI玩家
                let px = Math.random() * this.virtual_map_width;
                let py = Math.random() * this.virtual_map_height;
                this.players.push(new Player(this, px, py, 0.05, this.get_random_color(), 0.15, "robot"));
            }
        }
        else if (mode === "multi mode") {
            this.chat_field = new ChatField(this);
            this.mps = new MultiPlayerSocket(this);
            this.mps.uuid = this.players[0].uuid;

            this.mps.ws.onopen = function () {
                (<MultiPlayerSocket>outer.mps).send_create_player(outer.root.settings.username, outer.root.settings.photo, player_x, player_y);
            }
        }
    }

    hide() {  // 关闭playground界面时删除内部元素
        while (this.players && this.players.length > 0) {  // 用for循环有bug
            this.players[0].destroy();
        }
        // 不能直接清空WARLOCK_GAME_OBJECTS因为acapp端不同窗口共用全局变量
        if (this.game_map) {
            this.game_map.destroy();
            //this.game_map = null;
        }

        if (this.notice_board) {
            this.notice_board.destroy();
            //this.notice_board = null;
        }

        if (this.score_board) {
            this.score_board.destroy();
            //this.score_board = null;
        }

        this.$playground.empty();  // 清空html

        this.$playground.hide();
    }
}
