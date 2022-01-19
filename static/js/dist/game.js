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
        if (this.platform === "ACAPP") return false;  // 仅在web端执行

        $.ajax({
            url: "https://app1186.acapp.acwing.com.cn/settings/logout/",
            type: "GET",
            success: function(resp) {
                if (resp.result === "success") {
                    location.reload();
                }
            }
        });
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

    }

    show() {  // 打开playground界面
        this.$playground.show();
        // 打开playground界面后再初始化幕布大小
        this.root.$warlock_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true))

        for (let i = 0; i < 5; i++) {
            this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, this.get_random_color(), this.height * 0.15, false))
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
class FireBall extends WarlockGameObject {
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
        this.eps = 0.1;
    }

    start() {

    }

    update() {
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;

        for (let i = 0; i < this.playground.players.length; i ++) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
            }
        }
        this.render();
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
        this.destroy();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}class Player extends WarlockGameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
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
        this.is_me = is_me;  // 判断是否为玩家
        this.eps = 0.1;  // 坐标精度
        this.friction = 0.9;  // 摩擦力
        this.spent_time = 0;  // 记录游戏时间

        this.cur_skill = null;  // 记录当前是否握持有技能

        if (this.is_me) {
            this.img = new Image(); // canvas用图片填充圆形
            this.img.src = this.playground.root.settings.photo;
        }
    }

    start() {
        if (this.is_me) {
            this.add_listening_events();
        }
        else {  // ai随机移动
            let rx = Math.random() * this.playground.width;
            let ry = Math.random() * this.playground.height;
            this.move_to(rx, ry);
        }
    }

    // 全局监听函数，屏蔽右键菜单并接收用户操作
    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function() {
            return false;  // 屏蔽网页右键菜单
        });

        this.playground.game_map.$canvas.mousedown(function(e) {
            const rect = outer.ctx.canvas.getBoundingClientRect();  // 记录画布与屏幕的相对位置
            if (e.which === 3) {  // 按下鼠标右键移动
                outer.move_to(e.clientX - rect.left, e.clientY - rect.top);
            }
            else if (e.which === 1) {  // 按下鼠标左键发射技能
                if (outer.cur_skill === "fireball") {
                    outer.shoot_fireball(e.clientX - rect.left, e.clientY - rect.top)
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
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1;
        new FireBall(this.playground, this, x, y, vx, vy, radius, color, speed, move_length, this.playground.height * 0.01);
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
        if (this.radius < 10) {
            this.destroy();
            return false;
        }
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 200;
        this.speed *= 1.2;
    }

    update() {
        this.spent_time += this.timedelta / 1000;  // 记录时间

        // ai射击玩家
        if (!this.is_me && this.spent_time > 3 && Math.random() < 1 / 300.0) {
            let player = this.playground.players[0];
            let targetx = player.x + player.speed * player.vx * this.timedelta / 1000 * 0.3;
            let targety = player.y + player.speed * player.vy * this.timedelta / 1000 * 0.3;
            if (player.radius > 10) {
                this.shoot_fireball(targetx, targety);
            }     
        }

        if (this.damage_speed > 100) {
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

                if (!this.is_me) {  // ai随机移动                                     
                    let rx = Math.random() * this.playground.width;
                    let ry = Math.random() * this.playground.height;
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
        this.render();
    }

    render() {
        if (this.is_me) {  // canvas用图片填充圆形
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
            this.ctx.restore();
        }
        else {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);  // 生成圆形
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
    }

    
    on_destroy() {
        /*
        for (let i = 0; i < this.playground.players.length; i ++) {
            if (this.playground.player[i] === this) {
                this.playground.players.splice(i, 1);
            }
        }
        */
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
        this.eps = 0.1;
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
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
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
            退出登录
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
            outer.root.playground.show();
        });
        this.$multi_mode.click(function () {
            console.log("click multi mode");
        });
        this.$settings.click(function () {
            console.log("click settings");
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