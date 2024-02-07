class AudioPlayer {
    constructor() { }

    play(el) {
        if (!el.ended) {
            this._stop(el);
        }
        el.play();
    }

    _stop(el) {
        el.pause();
        el.currentTime = 0.0;
    }
}
const player = new AudioPlayer();
const bgm = document.querySelector('#bgm');
const bgm2 = document.querySelector('#bgm2');
const bgm3 = document.querySelector('#bgm3');
const clearLine = document.querySelector('#clear_line');
const drop = document.querySelector('#drop');
const gameOver = document.querySelector('#game_over');
const swap = document.querySelector('#swap');
const attack_block = document.querySelector('#attack_block');
const eat_item = document.querySelector('#eat_item');
const paddle_sound = document.querySelector('#paddle_sound');
const stageClear = document.querySelector('#stageClear');
