class WarlockGameMenu {
    constructor(root) {  // root即为前端传入的对象
        this.root = root;
        this.$menu = $(`
<div class="warlock_game_menu">
</div>
`);
        this.root.$warlock_game.append(this.$menu);
    }
}