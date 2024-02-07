//--------------------------------------블럭미리보여주는곳 -----------------------------------------------
const nextBlockCanvas = document.querySelector("#block-container"); //블럭 미리보여줄것
const nextBlockContext = nextBlockCanvas.getContext("2d"); // //캔버스 그리는거 타입
const nextBoarderWidth = 2;
const nextBlocksize = 25;
const nextwidthBlockCount = 5;
const nextheightBlockCount = 15;
nextBlockCanvas.width = 150;
nextBlockCanvas.height = 150;

const nextBlockCanvas2 = document.querySelector("#block-container2"); //블럭 미리보여줄것 다다음
const nextBlockContext2 = nextBlockCanvas2.getContext("2d"); // //캔버스 그리는거 타입
const nextBoarderWidth2 = 2;
const nextBlocksize2 = 25;
const nextwidthBlockCount2 = 5;
const nextheightBlockCount2 = 15;
nextBlockCanvas2.width = 150;
nextBlockCanvas2.height = 150;

const saveBlockCanvas = document.querySelector("#saveblock-container"); //블럭 미리보여줄것 다다음
const saveBlockContext = saveBlockCanvas.getContext("2d"); // //캔버스 그리는거 타입
const saveBoarderWidth = 2;
const saveBlocksize = 25;
const savewidthBlockCount = 5;
const saveheightBlockCount = 15;
saveBlockCanvas.width = 150;
saveBlockCanvas.height = 250;
//-------------------------------------------------------------------------------------------------------
// -------------------------------------블럭떨어지는곳 --------------------------------------------------
const canvas = document.querySelector("#tetrisCanvas"); //캔버스 객체 자체
const context = canvas.getContext("2d"); //캔버스 그리는거 타입
const borderWidth = 1; //테트리스 블럭마다 띄우는정도
const blocksize = 15; //블럭사이즈
const widthBlockCount = 12; //가로 블럭수
const heightBlockCount = 29; // 세로 블럭수
canvas.width = widthBlockCount * (blocksize + borderWidth); //canvas 전체 가로
canvas.height = heightBlockCount * (blocksize + borderWidth); // canvas 전체 세로
let move_x = 4; //테트리스의 x좌표를 바꾸는것
let move_y = 0; //테트리스의 y좌표를 바꾸는것
let rotate = 0; //회전
let rotate_num = Math.abs(rotate) % 4; //테트리스 회전 숫자
let overlap_y = 1; // 블럭이 겹쳤을때 안겹치는곳까지 올려줌
let controll_x = 0; // 오른쪽으로 빠져나가지 않게하는 변수
let controll_x_min = 2; // 왼쪽으로 빠져나가지 않게하는 변수
let controll_y = 0; // 높이가 높은 블럭을 내렸을때 맨밑바닥인경우 조절해줌
let blockLocationArray_x = []; //블럭의 x좌표 값들 저장하는배열
let blockLocationArray_y = []; //블럭의 y좌표 값들 저장하는배열
let countTrue = 0; // 테트리스 한줄이 전부 채워졋는지 확인하는 변수
let score = 0; //점수
let stacked_number = 0; // 계산용 변수
let block_w = [0, 0, 0, 0]; // 현재 블럭좌표 w
let block_h = [0, 0, 0, 0]; // 현재 블럭좌표 h
let can_move = true;
let speedCount = 0;
let upkeyCount = 0;

let saveBlockIndex = 0; // 저장블럭
let tmpBlockIndex = 0; //임시블럭
let speedUp = 0;
//테스트용------------------------------------------------이거 한눈에볼라고 일단 여기다 적어놨어요 나중에 정리할게요
