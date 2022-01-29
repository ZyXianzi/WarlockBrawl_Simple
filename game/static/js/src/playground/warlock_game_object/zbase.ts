let WARLOCK_GAME_OBJECTS: WarlockGameObject[] = [];

class WarlockGameObject {
    has_called_start: boolean;
    timedelta: number;
    uuid: string;

    constructor() {
        WARLOCK_GAME_OBJECTS.push(this);
        this.has_called_start = false;  // 记录元素是否执行过start函数
        this.timedelta = 0;  // 当前帧距离上一帧的时间间隔(ms)
        this.uuid = this.create_uuid();
    }

    create_uuid() {  // 给每个object创建一个唯一编号
        let res = "";
        for (let i = 0; i < 8; i ++) {
            let x = Math.floor(Math.random() * 10);
            res += x;
        }
        return res;
    }

    start() {  // 仅在第一帧执行一次

    }

    update() {  // 每一帧都执行一次

    }

    late_update() {  // 在每一帧的最后执行一次

    }

    on_destroy() {  // 在被删除前执行一次

    }

    destroy() {  // 删除当前物体
        this.on_destroy();

        for (let i = 0; i < WARLOCK_GAME_OBJECTS.length; i ++) {
            if (WARLOCK_GAME_OBJECTS[i] === this) {
                WARLOCK_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp: number;  // 记录上一帧的时间戳
let WARLOCK_GAME_ANIMATION = (timestamp: number) => {
    for (let i = 0; i < WARLOCK_GAME_OBJECTS.length; i ++) {
        let obj = WARLOCK_GAME_OBJECTS[i];
        if (!obj.has_called_start) {  // 检查是否执行过start函数
            obj.start();
            obj.has_called_start = true;
        }
        else {  // 不是第一帧就需要记录时间差
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }

    for (let i = 0; i < WARLOCK_GAME_OBJECTS.length; i ++) {
        let obj = WARLOCK_GAME_OBJECTS[i];
        obj.late_update();
    }

    last_timestamp = timestamp;

    requestAnimationFrame(WARLOCK_GAME_ANIMATION);
}

requestAnimationFrame(WARLOCK_GAME_ANIMATION);  // 自动刷新画面