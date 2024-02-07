const mainCanvas = document.querySelector('#main');
const mainContext = mainCanvas.getContext("2d");
mainCanvas.width = 720;
const blockWidth = 87;  // isk.js에도 block_width가 있어서 얘를 없애고 isk.js에 있는 block_width로 쓰거나 isk.js에 있는 block_width들을 얘로 바꾸거나 해야 할 것 같아요
const blockHeight = 20; // 얘도..
const blockSpace = 5;
const widthBlockCount = 11;
const heightBlockCount = 5;

mainContext.fillStyle = "#98DFFF"

const img = new Image();
img.src = '../team5/img/nomal_block.png';


img.onload = function () {
    for (let i = 0; i < widthBlockCount; i++) {
        for (let j = 0; j < heightBlockCount; j++) {
            let brickX = j * (blockWidth + 1) + 15; // x좌표값 계산
            let brickY = i * (blockHeight + 1) + 10; // y 좌표값 계산
            mainContext.drawImage(img, brickX, brickY, blockWidth, blockHeight);
        }
    }
}