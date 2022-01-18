class WarlockGameSettings {
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
}