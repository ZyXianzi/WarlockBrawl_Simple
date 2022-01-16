class WarlockGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="warlock_game_playground"></div>`);
        
        // this.hide();
        this.root.$warlock_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();

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
}