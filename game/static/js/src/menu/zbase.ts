import { WarlockGame } from "../zbase";

export class WarlockGameMenu {
    root: WarlockGame;
    $menu: JQuery<HTMLElement>;
    $single_mode: JQuery<HTMLElement>;
    $multi_mode: JQuery<HTMLElement>;
    $settings: JQuery<HTMLElement>;

    constructor(root: WarlockGame) {  // root即为前端传入的对象
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
        this.$single_mode.on("click", () => {
            outer.hide();
            outer.root.playground.show("single mode");
        });
        this.$multi_mode.on("click", () => {
            outer.hide();
            outer.root.playground.show("multi mode");
        });
        this.$settings.on("click", () => {
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