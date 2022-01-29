import { Settings } from "./settings/zbase";
import { WarlockGameMenu } from "./menu/zbase";
import { WarlockGamePlayground } from "./playground/zbase";

// 总脚本
export class WarlockGame {
    id: string;
    $warlock_game: any;
    AcWingOS: any;
    settings: Settings;
    menu: WarlockGameMenu;
    playground: WarlockGamePlayground;

    constructor(id: string, AcWingOS: any) {
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
