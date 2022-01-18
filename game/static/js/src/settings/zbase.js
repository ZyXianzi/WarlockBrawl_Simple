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

        this.root.$warlock_game.append(this.$settings);

        this.start();
    }

    start() {
        this.getinfo();
        this.add_listening_events();
    }

    add_listening_events() {
        this.add_listening_events_login();
        this.add_listening_events_register();
    }

    add_listening_events_login() {
        let outer = this;
        this.$login_register.click(function() {
            outer.register();
        });
    }

    add_listening_events_register() {
        let outer = this;
        this.$register_login.click(function() {
            outer.login();
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

    getinfo() {
        let outer = this;

        $.ajax({
            url: "https://app1186.acapp.acwing.com.cn/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: function(resp) {
                console.log(resp);
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
}