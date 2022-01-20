class WarlockGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="warlock_game_playground"></div>`);
        
        this.hide();
        this.root.$warlock_game.append(this.$playground);

        this.start();
    }

    get_random_color() {
        let colors = [
                "DeepSkyBlue", "FireBrick", "Pink", "Grey", "SpringGreen",
                "SlateBlue", "Cyan", "Khahi", "RosyBrown", "Violet",
                "Aquamarine", "CadetBlue", "IndianRed", "OringeRed", "MediumPurple"
                ];
        return colors[Math.floor(Math.random() * 15)];
    }

    start() {
        let outer = this;
        $(window).resize(function() {  // 用户改变窗口大小时触发
            outer.resize();
        });
    }

    resize() {  // 渲染地图为16：9
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;  // 设定基准

        if (this.game_map) this.game_map.resize();
    }

    show(mode) {  // 打开playground界面
        let outer = this;
        this.$playground.show();
        // 打开playground界面后再初始化幕布大小
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        // 打开地图后再初始化地图大小
        this.resize();

        this.players = [];
        this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "white", 0.15, "me", this.root.settings.username, this.root.settings.photo))

        if (mode === "single mode") {
            for (let i = 0; i < 5; i++) {
                this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, this.get_random_color(), 0.15, "robot"))
            }
        }
        else if (mode === "multi mode") {
            this.mps = new MultiPlayerSocket(this);

            this.mps.ws.onopen = function() {
                outer.mps.send_create_player();
            }
        }
    }

    hide() {  // 关闭playground界面
        this.$playground.hide();
    }
}
