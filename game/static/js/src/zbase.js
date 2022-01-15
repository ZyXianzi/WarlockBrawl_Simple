// 总脚本
class WarlockGame {
    constructor(id) {
        this.id = id;
        this.$warlock_game = $('#' + id);
        this.menu = new WarlockGameMenu(this);
    }
}