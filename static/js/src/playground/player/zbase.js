class Player extends WarlockGameObject {
    constructor(playground, x, y, radius, color, speed, character, username, photo) {

        console.log(character, username, photo);

        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;  // 当前坐标
        this.y = y;
        this.vx = 0;  // 当前移动方向
        this.vy = 0;
        this.damage_x = 0;  // 受击后的移动方向
        this.damage_y = 0;
        this.damage_speed = 0;
        this.move_length = 0;  // 移动距离
        this.radius = radius;  // 半径
        this.color = color;  // 颜色
        this.speed = speed;  // 单位：s
        this.character = character;  // 判断player类型
        this.username = username;  // 用户名
        this.photo = photo;  // 头像
        this.eps = 0.01;  // 坐标精度
        this.friction = 0.9;  // 摩擦力
        this.spent_time = 0;  // 记录游戏时间

        this.cur_skill = null;  // 记录当前是否握持有技能

        if (this.character !== "robot") {
            this.img = new Image(); // canvas用图片填充圆形
            this.img.src = this.photo;
        }
    }

    start() {
        if (this.character === "me") {
            this.add_listening_events();
        }
        else if (this.character === "robot") {  // ai随机移动
            let rx = Math.random() * this.playground.width / this.playground.scale;
            let ry = Math.random() * this.playground.height / this.playground.scale;
            this.move_to(rx, ry);
        }
    }

    // 全局监听函数
    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function() {
            return false;  // 屏蔽网页右键菜单
        });

        this.playground.game_map.$canvas.mousedown(function(e) {
            const rect = outer.ctx.canvas.getBoundingClientRect();  // 记录画布与屏幕的相对位置
            if (e.which === 3) {  // 按下鼠标右键移动
                outer.move_to((e.clientX - rect.left) / outer.playground.scale, (e.clientY - rect.top) / outer.playground.scale);
            }
            else if (e.which === 1) {  // 按下鼠标左键发射技能
                if (outer.cur_skill === "fireball") {
                    outer.shoot_fireball((e.clientX - rect.left) / outer.playground.scale, (e.clientY - rect.top) / outer.playground.scale)
                }
                outer.cur_skill = null;  // 发射完取消技能握持
            }
        });

        $(window).keydown(function(e) {
            if (outer.spent_time > 3 && e.which === 81) {  // 按下q键握持火球
                outer.cur_skill = "fireball";
                return false;
            }
        });
    }

    // 发射火球
    shoot_fireball(tx, ty) {
        let x = this.x, y = this.y;
        let radius = 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = 0.5;
        let move_length = 1;
        new FireBall(this.playground, this, x, y, vx, vy, radius, color, speed, move_length, 0.01);
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

    // 被技能击中
    is_attacked(angle, damage) {
        // 触发粒子效果
        for (let i = 0; i < 20 + Math.random() * 10; i++) {
            let x = this.x;
            let y = this.y;
            let radius = this.radius * 0.15 * Math.random();
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
        }

        this.radius -= damage;  // 半径作为血量
        if (this.radius < this.eps) {
            this.destroy();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 200;
        this.speed *= 1.2;
    }

    update() {
        this.update_move();
        this.render();
    }

    update_move() {
        this.spent_time += this.timedelta / 1000;  // 记录时间

        // ai射击玩家
        if (this.character === "robot" && this.spent_time > 3 && Math.random() < 1 / 300.0) {
            let player = this.playground.players[0];
            let targetx = player.x + player.speed * player.vx * this.timedelta / 1000 * 0.3;
            let targety = player.y + player.speed * player.vy * this.timedelta / 1000 * 0.3;
            if (player.character === "me") {
                this.shoot_fireball(targetx, targety);
            }
        }

        if (this.damage_speed > this.eps) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        }
        else {
            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;

                if (this.character === "robot") {  // ai随机移动                                     
                    let rx = Math.random() * this.playground.width / this.playground.scale;
                    let ry = Math.random() * this.playground.height / this.playground.scale;
                    this.move_to(rx, ry);
                }
            }
            else {
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);  // 单位换算
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
    }

    render() {
        let scale = this.playground.scale
        if (this.character !== "robot") {  // canvas用图片填充圆形
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, (this.x - this.radius) * scale, (this.y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale);
            this.ctx.restore();
        }
        else {
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);  // 生成圆形
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
    }

    on_destroy() {
        for (let i = 0; i < this.playground.players.length; i++) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
            }
        }
    }
    
}