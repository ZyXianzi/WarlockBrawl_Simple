class Player extends WarlockGameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;  // 当前坐标
        this.y = y;
        this.vx = 0;  // 当前速度分量
        this.vy = 0;
        this.move_length = 0;  // 移动距离
        this.radius = radius;  // 半径
        this.color = color;  // 颜色
        this.speed = speed;  // 单位：s
        this.is_me = is_me;  // 判断是否为玩家
        this.eps = 0.1;  // 坐标精度

        this.cur_skill = null;  // 记录当前是否握持有技能
    }

    start() {
        if (this.is_me) {
            this.add_listening_events();
        }
    }

    // 全局监听函数，屏蔽右键菜单并接收用户操作
    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function() {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e) {
            if (e.which === 3) {  // 按下鼠标右键移动
                outer.move_to(e.clientX, e.clientY);
            }
            else if (e.which === 1) {  // 按下鼠标左键发射技能
                if (outer.cur_skill === "fireball") {
                    outer.shoot_fireball(e.clientX, e.clientY)
                }
                outer.cur_skill = null;  // 发射完取消技能握持
            }
        });

        $(window).keydown(function(e) {
            if (e.which === 81) {  // 按下q键握持火球
                outer.cur_skill = "fireball";
                return false;
            }
        });
    }

    shoot_fireball(tx, ty) {
        let x = this.x, y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1;
        new FireBall(this.playground, this, x, y, vx, vy, radius, color, speed, move_length);
    }

    // 获取当前位置与目标位置间的距离
    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // 移动玩家到目标位置
    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    update() {
        if (this.move_length < this.eps) {
            this.move_length = 0;
            this.vx = this.vy = 0;
        }
        else {
            let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);  // 单位换算
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.move_length -= moved;
        }
        this.render();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);  // 生成圆形
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}