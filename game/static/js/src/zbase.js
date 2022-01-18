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
