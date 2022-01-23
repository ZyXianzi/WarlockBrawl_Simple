class ChatField {
    constructor(playground) {
        this.playground = playground;

        this.$history = $(`<div class="warlock_game_chat_field_history"></div>`);
        this.$input = $(`<input type="text" class="warlock_game_chat_field_input">`);

        this.$history.hide();
        this.$input.hide();
        this.func_id = null;  // 检测计时器是否在运行
        this.playground.$playground.append(this.$history);
        this.playground.$playground.append(this.$input);

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {  // 监听键盘
        let outer = this;
        this.$history.on("contextmenu", function () {
            return false;  // 屏蔽网页右键菜单
        });
        this.$input.on("contextmenu", function () {
            return false;  // 屏蔽网页右键菜单
        });
        this.$input.keydown(function (e) {
            if (e.which === 27) {
                outer.hide_input();
                return false;
            }
            else if (e.which === 13) {
                let username = outer.playground.root.settings.username;
                let text = outer.$input.val();
                if (text) {
                    outer.$input.val("");
                    outer.add_message(username, text);
                    outer.playground.mps.send_message(username, text);
                }
                return false;
            }
        });
    }

    render_message(message) {
        return $(`<div>${message}</div>`);
    }

    add_message(username, text) {
        this.show_history();
        let message = `[${username}] ${text}`;
        this.$history.append(this.render_message(message));
        this.$history.scrollTop(this.$history[0].scrollHeight);
    }

    show_history() {
        let outer = this;
        this.$history.fadeIn();

        if (this.func_id) clearTimeout(this.func_id);

        this.func_id = setTimeout(function() {
            outer.$history.fadeOut();  // 淡出（jquery）
            outer.func_id = null;
        }, 3000);
    }

    show_input() {
        this.show_history();
        this.$input.show();
        this.$input.focus();
    }

    hide_input() {
        this.$input.hide();
        this.playground.game_map.$canvas.focus();
    }
}