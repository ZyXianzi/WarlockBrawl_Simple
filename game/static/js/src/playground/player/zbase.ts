import { WarlockGamePlayground } from "../zbase";
import { FireBall } from "../skill/fireball/zbase";
import { Particle } from "../particle/zbase";
import { NoticeBoard } from "../notice_board/zbase";
import { ChatField } from "../chat_field/zbase";
import { ScoreBoard } from "../score_board/zbase";
import { MultiPlayerSocket } from "../socket/multiplayer/zbase";
import { GameMap } from "../game_map/zbase";

export class Player extends WarlockGameObject {
    playground: WarlockGamePlayground;
    ctx: CanvasRenderingContext2D;
    x: number;  // 当前坐标
    y: number;
    tx: number | null = null;  // 当前移动目标的坐标
    ty: number | null = null;
    mx?: number;  // 当前鼠标指针坐标（快捷施法用）
    my?: number;
    vx: number;  // 当前移动方向
    vy: number;
    damage_x: number;  // 受击后的移动方向
    damage_y: number;
    damage_speed: number;  // 受击后的移动速度
    move_length: number;  // 移动距离
    radius: number;  // 自身半径
    color: string;  // 自身颜色
    speed: number;  // 自身移动速度
    character: string;  // 玩家角色（玩家，敌人，机器人）
    username?: string;  // 玩家用户名
    photo?: string;  // 玩家头像url
    eps: number;  // 误差值
    friction: number;  // 摩擦力（霸体值）
    spent_time: number;  // 游戏时间
    fireballs: FireBall[];  // 自身发射的火球
    cur_skill: string;  // 当前握持的技能
    img?: HTMLImageElement;  // 头像图片
    fireball_coldtime: number = 3;  // 火球cd
    fireball_image?: HTMLImageElement;  // 火球技能图片
    blink_coldtime: number = 5;  // 闪现cd
    blink_image?: HTMLImageElement;  // 闪现技能图片


    constructor(playground: WarlockGamePlayground, x: number, y: number, radius: number, color: string, speed: number, character: string, username?: string, photo?: string) {
        super();
        this.playground = playground;
        this.ctx = (<GameMap>this.playground.game_map).ctx;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.character = character;
        this.username = username;
        this.photo = photo;
        this.eps = 0.009;
        this.friction = 0.9;
        this.spent_time = 0;
        this.fireballs = [];
        this.cur_skill = "";

        if (this.character !== "robot") {
            this.img = new Image(); // canvas用图片填充圆形
            this.img.src = <string>this.photo;
        }

        if (this.character === "me") {
            this.fireball_coldtime = 3;  // 火球cd 单位秒
            this.fireball_image = new Image();
            this.fireball_image.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_9340c86053-fireball.png";

            this.blink_coldtime = 5;
            this.blink_image = new Image();
            this.blink_image.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_daccabdc53-blink.png"
        }
    }

    start() {
        this.playground.player_count ++;
        (<NoticeBoard>this.playground.notice_board).write("匹配中...");

        if (this.playground.player_count >= 3) {
            this.playground.state = "fighting";
            (<NoticeBoard>this.playground.notice_board).write("Fighting");
        }

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
        (<GameMap>this.playground.game_map).$canvas.on("contextmenu", () => {
            return false;  // 屏蔽网页右键菜单
        });

        // 监听鼠标移动
        (<GameMap>this.playground.game_map).$canvas.on("mousemove", (e) => {
            const rect = outer.ctx.canvas.getBoundingClientRect();  // 记录画布与屏幕的相对位置
            outer.mx = (e.clientX - rect.left) / outer.playground.scale;
            outer.my = (e.clientY - rect.top) / outer.playground.scale;
        });

        // 监听鼠标点击事件
        (<GameMap>this.playground.game_map).$canvas.on("mousedown", (e) => {

            if (outer.playground.state !== "fighting") {  // 只有fighting阶段能操作
                return true;
            }

            const rect = outer.ctx.canvas.getBoundingClientRect();  // 记录画布与屏幕的相对位置
            if (e.which === 3) {  // 按下鼠标右键移动
                outer.tx = <number>outer.mx;
                outer.ty = <number>outer.my;
                outer.move_to(outer.tx, outer.ty);

                if (outer.playground.mode === "multi mode") {
                    (<MultiPlayerSocket>outer.playground.mps).send_move_to(outer.tx, outer.ty);
                }
            }
            // else if (e.which === 1) {  // 按下鼠标左键使用技能
            //     let tx = (e.clientX - rect.left) / outer.playground.scale;
            //     let ty = (e.clientY - rect.top) / outer.playground.scale;
            //     if (outer.cur_skill === "fireball") {
            //         if (outer.fireball_coldtime > outer.eps) {
            //             return false;
            //         }
            //         let fireball = outer.shoot_fireball(tx, ty);

            //         if (outer.playground.mode === "multi mode") {
            //             (<MultiPlayerSocket>outer.playground.mps).send_shoot_fireball(tx, ty, fireball.uuid);
            //         }
            //     }
            //     else if (outer.cur_skill === "blink") {
            //         if (outer.blink_coldtime > outer.eps) {
            //             return false;
            //         }
            //         outer.blink(tx, ty);

            //         if (outer.playground.mode === "multi mode") {
            //             (<MultiPlayerSocket>outer.playground.mps).send_blink(tx, ty);
            //         }
            //     }
            //     outer.cur_skill = "";  // 发射完取消技能握持
            // }
        });
        
        // 监听按下键的事件
        (<GameMap>this.playground.game_map).$canvas.on("keydown", (e) => {
            if (e.key === "Enter") {  // 按下回车键打开聊天框
                if (outer.playground.mode === "multi mode") {
                    (<ChatField>outer.playground.chat_field).show_input();
                    return false;
                }
            }
            else if (e.key === "Escape") {  // 按下esc关闭聊天框
                if (outer.playground.mode === "multi mode") {
                    (<ChatField>outer.playground.chat_field).hide_input();
                    return false;
                }
            }

            if (outer.playground.state !== "fighting") {  // 只有fighting阶段能操作
                return true;  // 避免截取游戏之外的操作
            }

            if (e.key === "q") {  // 按下q键握持火球
                if (outer.fireball_coldtime > outer.eps) {  // 检查技能cd
                    return false;
                }
                outer.cur_skill = "fireball";
                return false;
            }
            else if (e.key === "f") {  // 按下f键握持闪现
                if (outer.blink_coldtime > outer.eps) {  // 检查技能cd
                    return false;
                }
                outer.cur_skill = "blink";
                return false;
            }
        });

        // 监听抬起键的事件
        (<GameMap>this.playground.game_map).$canvas.on("keyup", (e) => {
            if (e.key === "q" && outer.cur_skill === "fireball") {
                let fireball = outer.shoot_fireball(<number>outer.mx, <number>outer.my);
                if (outer.playground.mode === "multi mode") {
                    (<MultiPlayerSocket>outer.playground.mps).send_shoot_fireball(<number>outer.mx, <number>outer.my, fireball.uuid);
                }
            }
            else if (e.key === "f" && outer.cur_skill === "blink") {
                outer.blink(<number>outer.mx, <number>outer.my);
                if (outer.playground.mode === "multi mode") {
                    (<MultiPlayerSocket>outer.playground.mps).send_blink(<number>outer.mx, <number>outer.my);
                }
            }
            outer.cur_skill = "";
        });
    }

    // 发射火球
    shoot_fireball(tx: number, ty: number) {
        let x = this.x, y = this.y;
        let radius = 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = 0.5;
        let move_length = 1;
        let fireball = new FireBall(this.playground, this, x, y, vx, vy, radius, color, speed, move_length, 0.01);
        this.fireballs.push(fireball);

        this.fireball_coldtime = 3;

        return fireball;  // 为了获取火球的uuid
    }

    blink(tx: number, ty: number) {
        let d = this.get_dist(this.x, this.y, tx, ty);
        d = Math.min(d, 0.5);
        let angle = Math.atan2(ty - this.y, tx - this.x)
        this.x += d * Math.cos(angle);
        this.y += d * Math.sin(angle);

        this.blink_coldtime = 5;
        this.move_length = 0;  // 闪现完停下来
    }

    destroy_fireball(uuid: string) {
        for (let i = 0; i < this.fireballs.length; i ++) {
            let fireball = this.fireballs[i];
            if (fireball.uuid === uuid) {
                fireball.destroy();
                break;
            }
        }
    }

    // 获取当前位置与目标位置间的距离
    get_dist(x1: number, y1: number, x2: number, y2: number) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // 移动玩家到目标位置
    move_to(tx: number, ty: number) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    // 被技能击中
    is_attacked(angle: number, damage: number) {
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

    receive_attack(x: number, y: number, angle: number, damage: number, ball_uuid: string, attacker: Player) {
        attacker.destroy_fireball(ball_uuid);
        this.x = x;
        this.y = y;
        this.is_attacked(angle, damage);
    }

    update() {
        this.spent_time += this.timedelta / 1000;  // 记录时间

        this.update_win();

        if (this.character === "me" && this.playground.state === "fighting") {
            this.update_coldtime();
        }
        this.update_move();
        this.render();
    }

    update_win() {
        if (this.playground.state === "fighting" && this.character === "me" && this.playground.players.length === 1) {
            this.playground.state = "over";
            (<ScoreBoard>this.playground.score_board).win();
        }
    }

    update_coldtime() {
        this.fireball_coldtime -= this.timedelta / 1000;
        this.fireball_coldtime = Math.max(this.fireball_coldtime, 0);
        this.blink_coldtime -= this.timedelta / 1000;
        this.blink_coldtime = Math.max(this.blink_coldtime, 0);
    }

    update_move() {
        // ai射击玩家
        if (this.character === "robot" && this.spent_time > 3 && Math.random() < 1 / 500.0) {
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
                this.tx = this.ty = null;

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
        let scale = this.playground.scale;

        // 绘制移动路径
        if (this.character === "me" && this.move_length !== 0) {
            this.render_route("move", <number>this.tx, <number>this.ty);
        }

        // 绘制火球路径及射程
        if (this.character === "me" && this.cur_skill === "fireball") {
            this.render_route("fireball", <number>this.mx, <number>this.my);
        }

        // 绘制闪现路径及射程
        if (this.character === "me" && this.cur_skill === "blink") {
            this.render_route("blink", <number>this.mx, <number>this.my)
        }

        // 若是真实玩家则填充头像
        if (this.character !== "robot") {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(<HTMLImageElement>this.img, (this.x - this.radius) * scale, (this.y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale);
            this.ctx.restore();
        }
        else {
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);  // 生成圆形
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }  
        
        // 绘制自己的技能图标及cd动画
        if (this.character === "me" && this.playground.state === "fighting") {
            this.render_skill_coldtime();
        }
    }

    render_skill_coldtime() {
        let scale = this.playground.scale;
        let x = 1.5, y = 0.9, r = 0.04;

        // 绘制火球技能图标
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(<HTMLImageElement>this.fireball_image, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale);
        this.ctx.restore();

        // 绘制冷却动画
        if (this.fireball_coldtime > 0) {  
            this.ctx.beginPath();  // 蒙版
            this.ctx.moveTo(x * scale, y * scale);
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.fireball_coldtime / 3) - Math.PI / 2, true);  // 生成圆形
            this.ctx.lineTo(x * scale, y * scale);
            this.ctx.fillStyle = "rgba(34, 34, 34, 0.8)";
            this.ctx.fill();
        }

        // 绘制闪现技能图标
        x = 1.62, y = 0.9, r = 0.04;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(<HTMLImageElement>this.blink_image, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale);
        this.ctx.restore();

         // 绘制冷却动画
        if (this.blink_coldtime > 0) {
            this.ctx.beginPath();  // 蒙版
            this.ctx.moveTo(x * scale, y * scale);
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.blink_coldtime / 5) - Math.PI / 2, true);  // 生成圆形
            this.ctx.lineTo(x * scale, y * scale);
            this.ctx.fillStyle = "rgba(34, 34, 34, 0.8)";
            this.ctx.fill();
        }
    }

    render_route(type: string, tx: number, ty: number) {
        let scale = this.playground.scale;
        // 移动路径
        if (type === "move") {
            this.ctx.save();  // 一定要加
            this.ctx.beginPath();  // 重置路线
            this.ctx.setLineDash([20, 30]);  // 设置虚线间隔
            this.ctx.lineCap = "round"  // 设置直线端点类型
            this.ctx.lineWidth = 4;  // 设置直线宽度
            this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";  // 设置直线样式
            this.ctx.moveTo(this.x * scale, this.y * scale);  // 设置起点
            this.ctx.lineTo(tx * scale, ty * scale);  // 设置终点
            this.ctx.stroke();  // 按照上面的设置开始绘制
            this.ctx.restore();  // 一定要加
        }
        // 火球路径
        else if (type === "fireball") {
            let d = this.get_dist(this.x, this.y, tx, ty);
            d = Math.min(d, 1);  // 直线长度不超过射程
            let angle = Math.atan2(ty - this.y, tx - this.x)
            let dx = d * Math.cos(angle);
            let dy = d * Math.sin(angle);

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.lineCap = "round";
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = "orange";
            this.ctx.moveTo(this.x * scale, this.y * scale);
            this.ctx.lineTo((this.x + dx) * scale, (this.y + dy) * scale);
            this.ctx.stroke();
            this.ctx.restore();
        }
        // 闪现路径
        else if (type === "blink") {
            let d = this.get_dist(this.x, this.y, tx, ty);
            d = Math.min(d, 0.5);  // 直线长度不超过射程
            let angle = Math.atan2(ty - this.y, tx - this.x)
            let dx = d * Math.cos(angle);
            let dy = d * Math.sin(angle);

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.lineCap = "round";
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = "blue";
            this.ctx.moveTo(this.x * scale, this.y * scale);
            this.ctx.lineTo((this.x + dx) * scale, (this.y + dy) * scale);
            this.ctx.stroke();
            this.ctx.restore();
        }
    }

    on_destroy() {
        if (this.character === "me") {
            if (this.playground.state === "fighting") {
                this.playground.state = "over";  // 避免死了之后放技能
                (<ScoreBoard>this.playground.score_board).lose();
            }
        }
        for (let i = 0; i < this.playground.players.length; i++) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
                break;
            }
        }
    }
}