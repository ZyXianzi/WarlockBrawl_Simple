class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;

        this.ws = new WebSocket("wss://app1186.acapp.acwing.com.cn/wss/multiplayer/");

        this.start();
    }

    start() {

    }

    send_create_player() {
        this.ws.send(JSON.stringify({
            'message': "hello warlock server",
        }));
    }

    receive_create_player() {

    }
}