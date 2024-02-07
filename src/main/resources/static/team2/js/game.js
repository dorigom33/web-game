// 단어 카테고리와 단어들을 정의한 객체
const categories = {
    "쉬움": [],
    "보통": [],
    "어려움": []
};
window.addEventListener('load',async function(){
    const res = await fetch('/team2/random-words');
    const json = await res.json();
    const words = json.result;
    console.log(categories['쉬움'].length);
    console.log(categories);
    for(const word of words){
        if(word.name){
            if(word.name.length<3){
                categories['쉬움'].push(word.name);
            }else if(word.name.length<4){
                categories['보통'].push(word.name);
            }else{
                categories['어려움'].push(word.name);
            }
        }
    }
    console.log(categories['쉬움'].length);
    console.log(categories);

    for (let category in categories) {
        allWords = allWords.concat(categories[category].map(word => ({ word: word, category: category })));
    }
})
let allWords = [];  // 모든 단어를 한 배열로 합침

// HTML 요소들을 변수로 저장
const startButton = document.getElementById("startButton");
const wordContainer = document.getElementById("wordContainer");
const wordDisplay = document.getElementById("wordDisplay");
const wordInput = document.getElementById("wordInput");
const message = document.getElementById("message");
const triesDisplay = document.getElementById("tries");
const restartButton = document.getElementById("restartButton");
const timerDisplay = document.getElementById("timer");
const castle = document.querySelector('#castle');

const backgroundMusic = document.getElementById("backgroundMusic");
const arrowSound = document.getElementById("arrowSound");
const flyingSound = document.getElementById("flyingSound");
const hitSound = document.getElementById("hitSound");
const failSound = document.getElementById("failSound");
const destSound = document.getElementById("destSound");
const scoreDisplay = document.getElementById("score");


// 게임 상태와 타이머 등을 관리하는 변수들
let currentCategoryIndex = 0;
let currentWordIndex = 0;
let triesLeft = 5;
let startTime = 0;
let combo = 0;
let timerInterval;
let gameStarted = false;
let animationFrameId;
// 게임에 사용될 점수 변수 초기화
let score = 0;
let gameEndTime = 0; // 게임 종료 시간을 기록할 변수

// 음악 재생 여부를 나타내는 변수
let isMusicPlaying = true;
backgroundMusic.volume = 0.5;
arrowSound.volume = 1;
flyingSound.volume = 1;
hitSound.volume = 1;

// 음악 토글 버튼 클릭 이벤트 처리
musicToggleButton.addEventListener("click", function () {
    if (isMusicPlaying) {
        backgroundMusic.pause(); // 음악을 일시 정지
    } else {
        backgroundMusic.play(); // 음악을 재생
    }
    isMusicPlaying = !isMusicPlaying; // 상태를 토글
    updateMusicToggleButton(); // 버튼 상태 업데이트
});

// 음악 플레이어 상태에 따라 버튼 텍스트 업데이트
function updateMusicToggleButton() {
    if (isMusicPlaying) {
        // 음악이 재생 중인 경우 이미지를 설정합니다.
        musicToggleButton.innerHTML = '<img src="/team2/img/sound.png" alt="Sound Off" width="50" height="50">';
    } else {
        // 음악이 꺼져 있는 경우 이미지를 설정합니다.
        musicToggleButton.innerHTML = '<img src="/team2/img/nosound.png" alt="Sound On" width="50" height="50">';
    }
}


// 시작 버튼 클릭 이벤트 처리
startButton.addEventListener("click", function () {
    startGame();
});

// 배열을 섞는 함수
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 단어 이동 애니메이션 함수
function animateWord() {
    // 게임이 시작되지 않았을 때는 애니메이션을 실행하지 않음
    if (!gameStarted) {
        return;
    }

    // 아직 모든 단어가 표시되지 않은 경우
    if (currentCategoryIndex < allWords.length) {
        // 새로운 단어 엘리먼트 생성
        const dragon = document.createElement("div");
        const word = document.createElement("div");
        dragon.className = "dragon";
        word.textContent = allWords[currentCategoryIndex].word;
        word.className = "word";
        dragon.appendChild(word);
        wordContainer.appendChild(dragon);

        // 애니메이션에 사용되는 변수들 초기화
        const containerWidth = wordContainer.offsetWidth; // 컨테이너의 너비
        const wordWidth = dragon.offsetWidth; // 단어 엘리먼트의 너비
        const startPos = containerWidth; // 시작 위치

        // 문자 길이에 따른 애니메이션 속도 설정
        const durationByCategory = {
            "쉬움": 4,
            "보통": 6,
            "어려움": 8
        };

        const category = allWords[currentCategoryIndex].category;
        let duration = durationByCategory[category] || 7;

        let position = startPos; // 현재 위치
        let startTime = Date.now(); // 애니메이션 시작 시간

        // 단어 이동 애니메이션 함수
        function moveWord() {
            // 게임이 시작되지 않았을 때는 애니메이션을 실행하지 않음
            if (!gameStarted) {
                return;
            }
            const currentTime = Date.now();
            const elapsed = (currentTime - startTime) / 1000;
            // 현재 위치 계산
            position = startPos - (elapsed / duration) * (containerWidth + wordWidth);
            // 단어 위치 업데이트
            dragon.style.left = position + "px";

            // 단어가 화면 왼쪽을 벗어났는지 확인
            if (position < (castle.style.left + castle.style.width)) {
                cancelAnimationFrame(animationFrameId); // 애니메이션 중지
                wordContainer.removeChild(dragon); // 단어 엘리먼트 제거
                currentCategoryIndex++; // 다음 단어로 넘어감
                destSound.play(); // 실패 효과음 재생
                message.textContent = "break!";
                combo = 0;

                anime({
                    easing: 'easeInOutBounce',
                    targets: castle,
                    translateX: [10,-10,10,-10,10,0],
                    translateY: [-10,10,0,-10,10,0],
                    duration: 150,
                    changeBegin: function(){
                        castle.style.filter="brightness(150%)";
                    },
                    changeComplete: function(){
                        castle.style.filter="brightness(100%)";
                    },
                })

                triesLeft--; // 남은 시도 횟수 감소
                triesDisplay.textContent = `남은 횟수: ${triesLeft}`; // 남은 시도 횟수 업데이트


                if (triesLeft === 0) {
                    gameStarted = false;
                    message.textContent = "GAME OVER";
                    wordInput.disabled = true;
                    stopTimer();
                    restartButton.style.display = "block";
                    castle.classList.add('game-over');


                }

                // 시도 횟수가 3보다 작아지면 배경 이미지 변경
                if (triesLeft < 3) {
                    document.body.style.backgroundImage = "url('/team2/img/background2.png')";
                }

                // 현재 카테고리의 모든 단어가 표시되지 않은 경우
                if (currentCategoryIndex < allWords.length) {
                    displayWord(); // 다음 단어 표시
                } else {
                    message.textContent = "게임 종료!";
                    wordInput.disabled = true;
                    stopTimer();
                    restartButton.style.display = "block";
                    wordContainer.innerHTML = "";
                }
            } else {
                animationFrameId = requestAnimationFrame(moveWord);
            }
        }

        // 첫 번째 애니메이션 프레임 요청
        moveWord();
    }
}


// 다음 단어 표시 함수
function displayWord() {
    // 아직 모든 단어가 표시되지 않은 경우
    if (currentCategoryIndex < allWords.length) {
        // 입력 필드 활성화 및 초기화
        wordInput.disabled = false;
        wordInput.value = "";
        wordInput.focus();

        // 단어 이동 애니메이션 시작
        animateWord();
    } else {
        // 모든 단어가 표시된 경우
        setGameEndTime(); // 게임 종료 시간 설정

        // 점수 표시
        message.textContent = `게임 종료! 최종 점수: ${finalScore}`;
        scoreDisplay.textContent = `현재 점수: ${finalScore}`;
        wordInput.disabled = true; // 입력 필드 비활성화
        restartButton.style.display = "block"; // 재시작 버튼 표시
        wordContainer.innerHTML = ""; // 단어 컨테이너 내용 비우기
        clearSound.play(); // 클리어 효과음 재생
    }
}


// 사용자 입력 단어 확인 함수
function checkWord() {
    // 입력된 사용자 단어 가져오기 (공백 제거)
    const userInput = wordInput.value.trim();

    // 현재 단어 카테고리의 정답 단어와 카테고리 가져오기
    const { category, word } = allWords[currentCategoryIndex];

    let wordValue;
    if(combo<20){
        wordValue = getCategoryValue(category)+combo;
    }else{
        wordValue = getCategoryValue(category)+20;
    }


    // 사용자 입력이 정답과 일치하는 경우
    if (userInput === allWords[currentCategoryIndex].word) {
        combo += 1;
        message.textContent = combo + " Combo!"; // 정답 메시지 표시
        score += wordValue;
        updateScore(); // 점수 업데이트

        const arrow = document.createElement('div');
        arrow.className = 'arrow';
        document.body.appendChild(arrow);
        let effect;
        anime({
            targets: 'div.arrow',
            easing: 'easeInQuad',
            translateX: parseInt(getComputedStyle(document.querySelector('.dragon')).left), //단어 div의 x좌표
            translateY: - parseInt(getComputedStyle(document.querySelector('.dragon')).top)  //단어 div의 y좌표
                      + (parseInt(getComputedStyle(document.querySelector('.dragon')).height)/2), //height의 절반(중앙)
            rotate: 2000,
            duration: 300,
            changeBegin: function(anim){
                arrowSound.play();
                flyingSound.play();
                wordInput.disabled = true;
            },
            changeComplete: function(anim){
                wordInput.disabled = false;
                document.body.removeChild(arrow);
                hitSound.play();
                const currentWord = document.querySelector(".dragon");
                wordContainer.removeChild(currentWord); // 현재 단어 엘리먼트 제거
                cancelAnimationFrame(animationFrameId); // 애니메이션 중지
                currentCategoryIndex++; // 다음 단어로 넘어감
                displayWord(); // 다음 단어 표시
            }
        })
    } else {
        message.textContent = "break!"; // 오답 메시지 표시
        combo = 0;
        wordInput.value = ""; // 입력 필드 초기화
        triesLeft--; // 남은 시도 횟수 감소
        triesDisplay.textContent = `남은 횟수: ${triesLeft}`; // 남은 시도 횟수 업데이트
        failSound.play(); // 실패 효과음 재생
        anime({
            easing: 'easeInOutBounce',
            targets: document.body,
            translateX: [10,-10,10,-10,10,0],
            translateY: [-10,10,0,-10,10,0],
            duration: 150,
        })

        // 시도 횟수가 0인 경우
        if (triesLeft === 0) {
            gameStarted = false; // 게임 상태를 끝낸 상태로 변경
            message.textContent = "GAME OVER"; // 게임 오버 메시지 표시
            wordInput.disabled = true; // 입력 필드 비활성화
            stopTimer(); // 타이머 정지
            restartButton.style.display = "block"; // 재시작 버튼 표시

            castle.classList.add('game-over');
        }

        // 시도 횟수가 3보다 작아지면 배경 이미지 변경
        if (triesLeft < 3) {
            document.body.style.backgroundImage = "url('/team2/img/background2.png')";
        }
    }


}

// 카테고리에 따른 단어 점수를 반환하는 함수
function getCategoryValue(category) {
    switch (category) {
        case "쉬움":
            return 2;
        case "보통":
            return 4;
        case "어려움":
            return 6;
        default:
            return 0; // 다른 카테고리가 들어온 경우 0점으로 처리
    }
}

// 점수를 업데이트하는 함수
function updateScore() {
    scoreDisplay.textContent = `현재 점수: ${score}`;
}

// 게임 시작 함수
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        startButton.style.display = "none";
        startTime = Date.now();
        shuffleArray(allWords);
        wordContainer.innerHTML = "";
        displayWord();
        startTimer();
        backgroundMusic.play();
    }
}


// 타이머 시작 함수
function startTimer() {
    if (gameStarted) {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }
}

// 타이머 정지 함수
function stopTimer() {
    clearInterval(timerInterval);
}

// 타이머 업데이트 함수
function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    timerDisplay.textContent = `시간: ${elapsedTime}초`;
}
// 입력 필드 엔터 키 이벤트 처리 -> 엔터를 쳐서 단어를 입력시킴
wordInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        checkWord();
    }
});

// 게임 종료 시간을 설정하는 함수
function setGameEndTime() {
    const currentTime = Date.now();
    gameEndTime = currentTime;
}


// 게임 종료 시에 점수를 0으로 초기화하는 함수
function resetScore() {
    score = 0;
    updateScore(); // 점수 업데이트
}
const serverUrl = "/team2/point-infos"; // 서버에 점수를 저장하는 엔드포인트 경로
const finalScore = score;
// 저장 버튼 클릭 이벤트 처리
const saveButton = document.getElementById("saveButton");

saveButton.addEventListener("click", function () {
    // 서버 엔드포인트 URL
    // 게임 종료 시의 점수를 finalScore로 설정
    // 서버에서 uiNum 가져오기
    // 세션 uiNum 사용하도록 수정 23.12.20 최재환
    if (uiNum) {
                // 세션에서 가져온 uiNum을 사용할 수 있음
                // console.log("uiNum:", uiNum);

                // giNum
                const giNum = 8;

                // 서버에 보낼 데이터 객체 생성 (JSON 형식)
                const point = {
                    uiNum: uiNum,
                    giNum: giNum,
                    piPoint: finalScore
                };

                // 출력: 서버로 보내는 데이터를 콘솔에 출력
                // console.log("보내는 데이터:", point);

                // POST 요청 설정
                fetch(serverUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(point) // 데이터를 JSON 형식으로 변환하여 전송
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        alert("점수가 저장되었습니다.");
                    } else {
                        alert("점수 저장에 실패했습니다.");
                    }
                })
                .catch(error => {
                    console.error("서버와 통신 중 오류 발생:", error);
                    alert("서버와 통신에 문제가 발생했습니다.");
                });
		}else {
            console.log("세션에 사용자 정보가 없습니다.");
    }
});



// 다시 시작 버튼 클릭 이벤트 처리
restartButton.addEventListener("click", function () {
    // 게임 상태 초기화
    combo = 0;
    currentCategoryIndex = 0;
    triesLeft = 5;
    startTime = 0;

    // UI 초기화
    timerDisplay.textContent = "시간: 0";
    message.textContent = "";
    triesDisplay.textContent = `남은 횟수: ${triesLeft}`;
    restartButton.style.display = "none";
    wordInput.disabled = false;
    wordInput.value = "";

    // 배경 이미지를 원래 이미지로 변경
    document.body.style.backgroundImage = "url('/team2/img/background.png')";
    castle.classList.remove('game-over');

    // 게임 시작
    gameStarted = false; // 게임 상태를 끝낸 상태로 만든 후,
    startGame(); // 게임을 다시 시작합니다.

    // 점수 초기화
    resetScore();
});


