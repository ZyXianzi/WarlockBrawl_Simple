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
            游戏设置
        </div>
    </div>
</div>
`);
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
        });
    }

    show() {  // 显示menu界面
        this.$menu.show();
    }

    hide() {  // 关闭menu界面
        this.$menu.hide();
    }
}class WarlockGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
<div>
游戏界面
</div>
`)
        
        this.hide();
        this.root.$warlock_game.append(this.$playground);

        this.start();
    }

    start() {

    }

    show() {  // 打开playground界面
        this.$playground.show();
    }

    hide() {  // 关闭playground界面
        this.$playground.hide();
    }
}class WarlockGameSettings {
    constructor(root) {
        this.root = root;
        this.$settings = $(`
<div>
设置界面
</div>
`)

        this.hide();
        this.root.$warlock_game.append(this.$settings);

        this.start();
    }

    start() {

    }

    show() {  // 打开settings界面
        this.$settings.show();
    }

    hide() {  // 关闭settings界面
        this.$settings.hide();
    }
}// 总脚本
class WarlockGame {
    constructor(id) {
        this.id = id;
        this.$warlock_game = $('#' + id);
        this.menu = new WarlockGameMenu(this);
        this.playground = new WarlockGamePlayground(this);
        this.settings = new WarlockGameSettings(this);

        this.start();
    }

    start() {

    }
}