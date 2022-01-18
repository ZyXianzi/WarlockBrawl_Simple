// 总脚本
export class WarlockGame {
    constructor(id) {
        this.id = id;
        this.$warlock_game = $('#' + id);
        this.menu = new WarlockGameMenu(this);
        this.playground = new WarlockGamePlayground(this);
        // this.settings = new WarlockGameSettings(this);

        this.start();
    }

    start() {

    }
}
