// 总脚本
export class WarlockGame {
    constructor(id, AcWingOS) {
        this.id = id;
        this.$warlock_game = $('#' + id);
        this.AcWingOS = AcWingOS;

        this.settings = new Settings(this);
        this.menu = new WarlockGameMenu(this);
        this.playground = new WarlockGamePlayground(this);

        this.start();
    }

    start() {

    }
}
class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if (this.root.AcWingOS) this.platform = "ACAPP";
        this.username = "";
        this.photo = "";

        this.$settings = $(`
<div class="warlock_game_settings">
    <div class="warlock_game_settings_login">
        <div class="warlock_game_settings_title">
            登录
        </div>
        <div class="warlock_game_settings_username">
            <div class="warlock_game_settings_item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="warlock_game_settings_password">
            <div class="warlock_game_settings_item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="warlock_game_settings_submit">
            <div class="warlock_game_settings_item">
                <button>登录</button>
            </div>
        </div>
        <div class="warlock_game_settings_error_message">
        </div>
        <div class="warlock_game_settings_option">
            注册
        </div>
        <br>
        <div class="warlock_game_settings_acwing">
            <img width="30" src="https://app1186.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            <br>
            <div>
                AcWing一键登录
            </div>
        </div>
    </div>
    <div class="warlock_game_settings_register">
        <div class="warlock_game_settings_title">
            注册
        </div>
        <div class="warlock_game_settings_username">
            <div class="warlock_game_settings_item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="warlock_game_settings_password warlock_game_settings_password_first">
            <div class="warlock_game_settings_item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="warlock_game_settings_password warlock_game_settings_password_second">
            <div class="warlock_game_settings_item">
                <input type="password" placeholder="确认密码">
            </div>
        </div>
        <div class="warlock_game_settings_submit">
            <div class="warlock_game_settings_item">
                <button>注册</button>
            </div>
        </div>
        <div class="warlock_game_settings_error_message">
        </div>
        <div class="warlock_game_settings_option">
            登录
        </div>
        <br>
        <div class="warlock_game_settings_acwing">
            <img width="30" src="https://app1186.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            <br>
            <div>
                AcWing一键登录
            </div>
        </div>
    </div>
</div>
`);
        this.$login = this.$settings.find(".warlock_game_settings_login");
        this.$login_username = this.$login.find(".warlock_game_settings_username input");
        this.$login_password = this.$login.find(".warlock_game_settings_password input");
        this.$login_submit = this.$login.find(".warlock_game_settings_submit button");
        this.$login_error_message = this.$login.find(".warlock_game_settings_error_message");
        this.$login_register = this.$login.find(".warlock_game_settings_option");
        this.$login.hide();

        this.$register = this.$settings.find(".warlock_game_settings_register");
        this.$register_username = this.$register.find(".warlock_game_settings_username input");
        this.$register_password = this.$register.find(".warlock_game_settings_password_first input");
        this.$register_password_confirm = this.$register.find(".warlock_game_settings_password_second input");
        this.$register_submit = this.$register.find(".warlock_game_settings_submit button");
        this.$register_error_message = this.$register.find(".warlock_game_settings_error_message");
        this.$register_login = this.$register.find(".warlock_game_settings_option");
        this.$register.hide();

        this.$acwing_login = this.$settings.find('.warlock_game_settings_acwing img');

        this.root.$warlock_game.append(this.$settings);

        this.start();
    }

    start() {
        if (this.platform === "ACAPP") {
            this.getinfo_acapp();
        }
        else {
            this.getinfo_web();
            this.add_listening_events();
        }  
    }

    add_listening_events() {  // 操作web端登陆与注册
        let outer = this;
        this.add_listening_events_login();
        this.add_listening_events_register();

        this.$acwing_login.click(function() {
            outer.acwing_login();
        });
    }

    add_listening_events_login() {
        let outer = this;
        this.$login_register.click(function() {
            outer.register();
        });
        this.$login_submit.click(function() {
            outer.login_on_remote();
        });
    }

    add_listening_events_register() {
        let outer = this;
        this.$register_login.click(function() {
            outer.login();
        });
        this.$register_submit.click(function() {
            outer.register_on_remote();
        });
    }

    acwing_login() {
        $.ajax({
            url: "https://app1186.acapp.acwing.com.cn/settings/acwing/web/apply_code/",
            type: "GET",
            success: function(resp) {
                if (resp.result === "success") {
                    window.location.replace(resp.apply_code_url);
                }
            }
        });
    }

    login_on_remote() {  // 在远程服务器上登录
        let outer = this;
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_message.empty();

        $.ajax({
            url: "https://app1186.acapp.acwing.com.cn/settings/login/",
            type: "GET",
            data: {
                username: username,
                password: password,
            },
            success: function(resp) {
                if (resp.result === "success") {
                    location.reload();  // 刷新页面
                }
                else {
                    outer.$login_error_message.html(resp.result);
                }
            }
        });
    }

    register_on_remote() {  // 在远程服务器上注册
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_message.empty();

        $.ajax({
            url: "https://app1186.acapp.acwing.com.cn/settings/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: function (resp) {
                if (resp.result === "success") {
                    location.reload();
                }
                else {
                    outer.$register_error_message.html(resp.result);
                }
            }
        });
    }

    logout_on_remote() {  // 在远程服务器上登出
        if (this.platform === "ACAPP") {
            this.root.AcWingOS.api.window.close();
        }
        else {
            $.ajax({
                url: "https://app1186.acapp.acwing.com.cn/settings/logout/",
                type: "GET",
                success: function (resp) {
                    if (resp.result === "success") {
                        location.reload();
                    }
                }
            });
        }
    }

    register() {  // 打开注册界面
        this.$login.hide();
        this.$register.show();
    }

    login() {  // 打开登录界面
        this.$register.hide();
        this.$login.show();
    }

    acapp_login(appid, redirect_uri, scope, state) {
        let outer = this;
        this.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, function(resp) {
            if (resp.result === "success") {
                outer.username = resp.username;
                outer.photo = resp.photo;
                outer.hide();
                outer.root.menu.show();
            }
        });
    }

    getinfo_acapp() {  // 获取acapp端用户信息
        let outer = this;
        $.ajax({
            url: "https://app1186.acapp.acwing.com.cn/settings/acwing/acapp/apply_code/",
            type: "GET",
            success: function(resp) {
                if (resp.result === "success") {
                    outer.acapp_login(resp.appid, resp.redirect_uri, resp.scope, resp.state);
                }
            }
        });
    }

    getinfo_web() {  // 获取web端用户信息
        let outer = this;

        $.ajax({
            url: "https://app1186.acapp.acwing.com.cn/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: function(resp) {
                if (resp.result === "success") {
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    outer.hide();
                    outer.root.menu.show();
                }
                else {
                    outer.login();
                }
            }
        })
    }

    show() {  // 打开settings界面
        this.$settings.show();
    }

    hide() {  // 关闭settings界面
        this.$settings.hide();
    }
}class WarlockGamePlayground {
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

        this.mode = mode;

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
            this.mps.uuid = this.players[0].uuid;

            this.mps.ws.onopen = function() {
                outer.mps.send_create_player(outer.root.settings.username, outer.root.settings.photo);
            }
        }
    }

    hide() {  // 关闭playground界面
        this.$playground.hide();
    }
}
let WARLOCK_GAME_OBJECTS = [];

class WarlockGameObject {
    constructor() {
        WARLOCK_GAME_OBJECTS.push(this);
        this.has_called_start = false;  // 记录元素是否执行过start函数
        this.timedelta = 0;  // 当前帧距离上一帧的时间间隔(ms)
        this.uuid = this.create_uuid();
    }

    create_uuid() {  // 给每个object创建一个唯一编号
        let res = "";
        for (let i = 0; i < 8; i ++) {
            let x = parseInt(Math.floor(Math.random() * 10));
            res += x;
        }
        return res;
    }

    start() {  // 仅在第一帧执行一次

    }

    update() {  // 每一帧都执行一次

    }

    on_destroy() {  // 在被删除前执行一次

    }

    destroy() {  // 删除当前物体
        this.on_destroy();

        for (let i = 0; i < WARLOCK_GAME_OBJECTS.length; i ++) {
            if (WARLOCK_GAME_OBJECTS[i] === this) {
                WARLOCK_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;  // 记录上一帧的时间戳
let WARLOCK_GAME_ANIMATION = function(timestamp) {
    for (let i = 0; i < WARLOCK_GAME_OBJECTS.length; i ++) {
        let obj = WARLOCK_GAME_OBJECTS[i];
        if (!obj.has_called_start) {  // 检查是否执行过start函数
            obj.start();
            obj.has_called_start = true;
        }
        else {  // 不是第一帧就需要记录时间差
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;

    requestAnimationFrame(WARLOCK_GAME_ANIMATION);
}

requestAnimationFrame(WARLOCK_GAME_ANIMATION);  // 自动刷新画面
class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;

        this.ws = new WebSocket("wss://app1186.acapp.acwing.com.cn/wss/multiplayer/");

        this.start();
    }

    start() {
        this.receive();
    }

    receive() {  // 前端接收信息
        let outer = this;
        this.ws.onmessage = function(e) {
            let data = JSON.parse(e.data);
            let uuid = data.uuid;
            if (uuid === outer.uuid) return false;

            let event = data.event;
            if (event === "create_player") {
                outer.receive_create_player(uuid, data.username, data.photo);
            }
            else if (event === "move_to") {
                outer.receive_move_to(uuid, data.tx, data.ty);
            }
            else if (event === "shoot_fireball") {
                outer.receive_shoot_fireball(uuid, data.tx, data.ty, data.ball_uuid);
            }
            else if (event === "attack") {
                outer.receive_attack(uuid, data.attackee_uuid, data.x, data.y, data.angle, data.damage, data.ball_uuid);
            }
        }
    }

    send_create_player(username, photo) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "create_player",
            'uuid': outer.uuid,
            'username': username,
            'photo': photo,
        }));
    }

    get_player(uuid) {
        let players = this.playground.players;
        for (let i = 0; i < players.length; i ++) {
            let player = players[i];
            if (player.uuid === uuid) {
                return player;
            }
        }
        return null;
    }

    receive_create_player(uuid, username, photo) {
        let player = new Player(
            this.playground,
            this.playground.width / 2 / this.playground.scale,
            0.5,
            0.05,
            "white",
            0.15,
            "enemy",
            username,
            photo,
        );

        player.uuid = uuid;
        this.playground.players.push(player);
    }

    send_move_to(tx, ty) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "move_to",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
        }));
    }

    receive_move_to(uuid, tx, ty) {
        let player = this.get_player(uuid);

        if (player) {
            player.move_to(tx, ty);
        }
    }

    send_shoot_fireball(tx, ty, ball_uuid) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "shoot_fireball",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_shoot_fireball(uuid, tx, ty, ball_uuid) {
        let player = this.get_player(uuid);
        if (player) {
            let fireball = player.shoot_fireball(tx, ty);
            fireball.uuid = ball_uuid;
        }
    }

    send_attack(attackee_uuid, x, y, angle, damage, ball_uuid) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "attack",
            'uuid': outer.uuid,
            'attackee_uuid': attackee_uuid,
            'x': x,
            'y': y,
            'angle': angle,
            'damage': damage,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_attack(uuid, attackee_uuid, x, y, angle, damage, ball_uuid) {
        let attacker = this.get_player(uuid);
        let attackee = this.get_player(attackee_uuid);
        if (attacker && attackee) {
            attackee.receive_attack(x, y, angle, damage, ball_uuid, attacker);
        }
    }
}class FireBall extends WarlockGameObject {
    constructor(playground, player, x, y, vx, vy, radius, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.01;
    }

    start() {

    }

    update() {
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }

        this.update_move();

        if (this.player.character !== "enemy") {
            this.update_attack();
        }

        this.render();
    }

    update_move() {
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
    }

    update_attack() {
        for (let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
                break;
            }
        }
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // 判断物体是否碰撞
    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if (distance < this.radius + player.radius) {
            return true;
        }
        return false;
    }

    // 火球击中玩家
    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);  // 记录攻击角度
        player.is_attacked(angle, this.damage);

        if (this.playground.mode === "multi mode") {
            this.playground.mps.send_attack(player.uuid, player.x, player.y, angle, this.damage, this.uuid);
        }

        this.destroy();
    }

    render() {
        let scale = this.playground.scale;
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destroy() {
        let fireballs = this.player.fireballs;
        for (let i = 0; i < fireballs.length; i ++) {
            if (fireballs[i] === this) {
                fireballs.splice(i, 1);
                break;
            }
        }
    }
}class Player extends WarlockGameObject {
    constructor(playground, x, y, radius, color, speed, character, username, photo) {
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
        this.fireballs = [];

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
                let tx = (e.clientX - rect.left) / outer.playground.scale;
                let ty = (e.clientY - rect.top) / outer.playground.scale;
                outer.move_to(tx, ty);

                if (outer.playground.mode === "multi mode") {
                    outer.playground.mps.send_move_to(tx, ty);
                }
            }
            else if (e.which === 1) {  // 按下鼠标左键发射技能
                let tx = (e.clientX - rect.left) / outer.playground.scale;
                let ty = (e.clientY - rect.top) / outer.playground.scale;
                if (outer.cur_skill === "fireball") {
                    let fireball = outer.shoot_fireball(tx, ty);

                    if (outer.playground.mode === "multi mode") {
                        outer.playground.mps.send_shoot_fireball(tx, ty, fireball.uuid);
                    }
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
        let fireball = new FireBall(this.playground, this, x, y, vx, vy, radius, color, speed, move_length, 0.01);
        this.fireballs.push(fireball);

        return fireball;  // 为了获取火球的uuid
    }

    destroy_fireball(uuid) {
        for (let i = 0; i < this.fireballs.length; i ++) {
            let fireball = this.fireballs[i];
            if (fireball.uuid === uuid) {
                fireball.destroy();
                break;
            }
        }
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

    receive_attack(x, y, angle, damage, ball_uuid, attacker) {
        attacker.destroy_fireball(ball_uuid);
        this.x = x;
        this.y = y;
        this.is_attacked(angle, damage);
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
                break;
            }
        }
    }
    
}class Particle extends WarlockGameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
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
}class GameMap extends WarlockGameObject {
    constructor(playground) {
        super();  // 调用基类的构造函数
        this.playground = playground;
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext(`2d`);
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }

    start() {
        
    }

    resize() {  // 动态修改地图大小
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
class WarlockGameMenu {
    constructor(root) {  // root即为前端传入的对象
        this.root = root;
        this.$menu = $(`
<div class="warlock_game_menu">
    <div class="warlock_game_menu_field">
        <div class="warlock_game_menu_field_item warlock_game_menu_field_item_single_mode">
            单人模式
        </div>
        <br>
        <div class="warlock_game_menu_field_item warlock_game_menu_field_item_multi_mode">
            多人模式
        </div>
        <br>
        <div class="warlock_game_menu_field_item warlock_game_menu_field_item_settings">
            退出
        </div>
    </div>
</div>
`);
        this.$menu.hide();
        this.root.$warlock_game.append(this.$menu);  // 创建主菜单
        this.$single_mode = this.$menu.find('.warlock_game_menu_field_item_single_mode');  // 添加三个按钮
        this.$multi_mode = this.$menu.find('.warlock_game_menu_field_item_multi_mode');
        this.$settings = this.$menu.find('.warlock_game_menu_field_item_settings');

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$single_mode.click(function() {
            outer.hide();
            outer.root.playground.show("single mode");
        });
        this.$multi_mode.click(function () {
            outer.hide();
            outer.root.playground.show("multi mode");
        });
        this.$settings.click(function () {
            outer.root.settings.logout_on_remote();
        });
    }

    show() {  // 显示menu界面
        this.$menu.show();
    }

    hide() {  // 关闭menu界面
        this.$menu.hide();
    }
}