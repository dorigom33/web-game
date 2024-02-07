// Canvas 요소
const canvas = document.querySelector("#gameCanvas"); //getElementById -> querySelector로 변경
const ctx = canvas.getContext("2d");// var -> const로 변경
let x = canvas.width / 2;
let y = canvas.height - 130;// 공 시작 위치인 것 같은데 패달보다 위에서 시작하게 하려고 수치 조금 바꿈

let isStarted = false;
let interval;
let life = 3;
let life_html = '';
let isBallfloor = false;
let isGetItem2 = false;
let itemCount = 0; // 아이템 블록 개수
let StrongCount = 0;// 스트롱 블록 개수


const strong_block = new Image();
strong_block.src = "/team5/img/strong_block.png";
const nomal_block = new Image();
nomal_block.src = "/team5/img/nomal_block.png";
const nobroken_block = new Image();
nobroken_block.src = "/team5/img/nobroken_block.png";
const itemImage = new Image(); // 새 이미지 객체 생성
itemImage.src = "/team5/img/item_block.png"; // 아이템 이미지 파일 경로 설정
const paddleImage = new Image();
paddleImage.src = "/team5/img/paddle.png";
const paddleImage2 = new Image();
paddleImage2.src = "/team5/img/paddle2.png";
const ballImage = new Image();
ballImage.src = "/team5/img/ball.png";
const PowerballImage = new Image();
PowerballImage.src = "/team5/img/ball4.png";
const longPaddleImage = new Image();
longPaddleImage.src = "/team5/img/long_paddle.png";
const stickyPaddleImage = new Image();
stickyPaddleImage.src = "/team5/img/sticky_paddle.png";

const item1 = new Image();
item1.src = "/team5/img/item1.png";
const item2 = new Image();
item2.src = "/team5/img/item2.png";
const item3 = new Image();
item3.src = "/team5/img/item3.png";
const item4 = new Image();
item4.src = "/team5/img/item4.png";

// 코드 마음대로 바꿔서 죄송합니다. 아이템 버그 고치는데 이 방법밖에 생각이 안나서.. 원래 배열에 들어갔던 숫자가 blockNum이고 다른건 신경 안 쓰셔도 됩니다. -류승호-
//----------------------------------------------------------------
//  1단계
function drawStage1() {
    for (let i = 0; i < rows; i++) {
        Board[i] = [];
        for (let j = 0; j < cols; j++) {
            if (j !== 0 && j !== cols - 1 && i > 1) {
                Board[i][j] = {
                    blockNum: 1,
                };
            }
        }
    }

    while (itemCount < 8) {
        const randomRow = Math.floor(Math.random() * (rows - 2)) + 2; // 2 이상의 행
        const randomCol = Math.floor(Math.random() * (cols - 2)) + 1; // 1 이상, cols - 2 이하의 열
        if (Board[randomRow][randomCol].blockNum !== 5) {
            Board[randomRow][randomCol].blockNum = 5;
            Board[randomRow][randomCol].randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
            itemCount++;
        }
    }

    // 안뽀개지는 블럭들 임의로 지정
    Board[6][5].blockNum = 10;
    Board[6][6].blockNum = 10;
    Board[6][4].blockNum = 10;
    Board[6][7].blockNum = 10;
    Board[5][5].blockNum = 10;
    Board[5][6].blockNum = 10;
    Board[5][4].blockNum = 10;
    Board[5][7].blockNum = 10;
}

// 2단계
// 2단계
// 2단계
function drawStage2() {
    for (let i = 0; i < rows; i++) {
        Board[i] = [];
    }
    for (let i = 2; i < rows; i++) {
        for (let j = i + 3; j < cols; j++) {
            Board[i][j] = {
                blockNum: 1
            }
        }
    }
    for (let i = rows; i > 1; i--) {
        for (let j = 0; j < rows - i; j++) {
            Board[i][j] = {
                blockNum: 1
            }
        }
    }

    itemCount = 0; // 초기화 안해서 아이템블록이랑 스트롱블록이 생성이 안되거였음.
    StrongCount = 0;

    while (itemCount <= 8 && StrongCount <= 7) {
        const randomRow = Math.floor(Math.random() * (rows - 2)) + 2;
        const randomCol = Math.floor(Math.random() * (cols - (randomRow + 3))) + (randomRow + 3);

        // 생성될 블록의 좌표가 게임 보드의 범위 내에 있는지 확인
        if (randomRow >= 0 && randomRow < rows && randomCol >= 0 && randomCol < cols) {
            if (Board[randomRow][randomCol].blockNum !== 5 && Board[randomRow][randomCol].blockNum !== 2) {
                // 아이템을 5로, 혹은 2로 설정
                if (Math.random() < 0.5) {
                    Board[randomRow][randomCol].blockNum = 5;
                    Board[randomRow][randomCol].randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
                    itemCount++;
                } else {
                    Board[randomRow][randomCol].blockNum = 2;
                    StrongCount++;
                }
            }
        }
    }
}









// 3단계
function drawStage3() {
    for (let i = 0; i < rows; i++) {
        Board[i] = [];
        for (let j = 0; j < cols; j++) {
            if (i % 2 === 0 && j % 2 === 1) {
                Board[i][j] = {
                    blockNum: 1
                }
            } else if (i % 2 === 1 && j % 2 === 0) {
                Board[i][j] = {
                    blockNum: 1
                }
            } else {
                Board[i][j] = {
                    blockNum: 0
                } // 나머지 요소 초기화 (0 또는 다른 값으로 초기화)
            }
        }
    }

    // 아이템 블록 5개 생성했는데 기존에 가운데 블록 생성되어있어서 일부러 생성한건지 몰라서 그냥 냅둠 stage2도 마찬가지

    itemCount = 0;
    while (itemCount < 5) {
        const randomRow = Math.floor(Math.random() * rows);
        const randomCol = Math.floor(Math.random() * cols);

        if (Board[randomRow][randomCol].blockNum !== 5 && Board[randomRow][randomCol].blockNum !== 2 && Board[randomRow][randomCol].blockNum !== 9) {
            Board[randomRow][randomCol].blockNum = 5; // 아이템 블록
            Board[randomRow][randomCol].randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
            itemCount++;
        }
    }

    // 스트롱 블록 5개 생성
    StrongCount = 0;
    while (StrongCount < 5) {
        const randomRow = Math.floor(Math.random() * rows);
        const randomCol = Math.floor(Math.random() * cols);

        if (Board[randomRow][randomCol].blockNum !== 5 && Board[randomRow][randomCol].blockNum !== 2 && Board[randomRow][randomCol].blockNum !== 9) {
            Board[randomRow][randomCol].blockNum = 2; // 스트롱 블록
            StrongCount++;
        }
    }

    // nobroken_block 배치
    Board[9][0].blockNum = 10; // nobroken_block 오른쪽 아래
    Board[8][11].blockNum = 10; // nobroken_block 왼쪽 아래
}


