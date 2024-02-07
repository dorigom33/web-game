let dealerSum = 0;
let yourSum = 0;
let dealerAceCount = 0;
let yourAceCount = 0;
let hidden;
let deck = [];
let round = 1;
let roundResults = [];
let userMoney = 100;
let userBet = 0;
let dealerHiddenCardImage;

// 덱, 사용자 돈, 사용자 베팅 관련 엘리먼트
const betInput = document.getElementById("bet");
const userMoneyDisplay = document.getElementById("user-money");
const betInfo = document.getElementById("bet-info");
const nextRoundButton = document.getElementById("next-round");
const restartButton = document.getElementById("restart");
const hitButton = document.getElementById("hit");
const standButton = document.getElementById("stand");

// 게임 결과 및 라운드 업데이트 엘리먼트
const roundNumberDisplay = document.getElementById("round-number");
const dealerSumDisplay = document.getElementById("dealer-sum");
const yourSumDisplay = document.getElementById("your-sum");
const resultsDisplay = document.getElementById("results");
const hiddenCardImage = document.getElementById("hidden");
const yourCardsDisplay = document.getElementById("your-cards");
const dealerCardsDisplay = document.getElementById("dealer-cards");
const roundResultsList = document.getElementById("round-results");

window.onload = function () {
    buildDeck();
    shuffleDeck();
    startGame();
    document.getElementById("place-bet").addEventListener("click", placeBet);
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]);
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

function placeBet() {
    const betAmount = parseInt(betInput.value);

    if (betAmount <= 0 || betAmount % 10 !== 0 || betAmount > userMoney) {
        alert("유효하지 않은 베팅입니다. 10의 배수이고 가진 돈 이내에서 베팅하세요.");
        return;
    }

    userBet = betAmount;
    userMoney -= userBet;
    userMoneyDisplay.innerText = userMoney;

    // 베팅 섹션을 숨김
    betInfo.style.display = "none";

    startGame();
}

function startGame() {
    if (round > 5) {
        document.getElementById("next-round").style.display = "none";
        document.getElementById("restart").style.display = "block";
        return;
    }

    // Hit 및 Stand 버튼 숨김
    document.getElementById("hit").style.display = "none";
    document.getElementById("stand").style.display = "none";

    if (userBet > 0) {
        // 베팅 섹션을 숨김
        document.getElementById("bet-info").style.display = "none";
        // Hit 및 Stand 버튼 표시
        document.getElementById("hit").style.display = "inline-block";
        document.getElementById("stand").style.display = "inline-block";
        return;
    }

    dealerSum = 0;
    yourSum = 0;

    document.getElementById("results").innerText = "";

    document.getElementById("dealer-cards").innerHTML = "";
    document.getElementById("your-cards").innerHTML = "";

    document.getElementById("round-number").innerText = round;

    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    let hiddenCardImg = document.createElement("img");
    hiddenCardImg.id = "hidden";
    hiddenCardImg.src = "/team2/img/cards/BACK.png";
    document.getElementById("dealer-cards").appendChild(hiddenCardImg);

    // 추가: 딜러의 숨겨진 카드 이미지 엘리먼트 초기화
    dealerHiddenCardImage = hiddenCardImg;

    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "/team2/img/cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").appendChild(cardImg);
    }
    console.log(dealerSum);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "/team2/img/cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").appendChild(cardImg);
    }

    console.log(yourSum);

    document.getElementById("stand").addEventListener("click", stand);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("bet").value = "";
    document.getElementById("place-bet").disabled = false;


    document.getElementById("next-round").style.display = "none";
}



function nextRound() {
    returnToDeck();

    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;

    dealerSumDisplay.innerText = "";
    yourSumDisplay.innerText = "";
    resultsDisplay.innerText = "";
    hiddenCardImage.src = "/team2/img/cards/BACK.png";

    // 베팅 섹션을 다시 표시
    betInfo.style.display = "block";

    if (round > 5) {
        userMoneyDisplay.innerText = userMoney;
        nextRoundButton.style.display = "none";
        restartButton.style.display = "block";
    } else {
        nextRoundButton.style.display = "block";
        restartButton.style.display = "none";
        startGame();
    }
}

document.getElementById("next-round").addEventListener("click", nextRound);

function hit() {
    if (deck.length === 0) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "/team2/img/cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    yourCardsDisplay.append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) {
        hitButton.removeEventListener("click", hit);
        endRound("패배");
    }
}

function stand() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);


    dealerHiddenCardImage.src = "/team2/img/cards/" + hidden + ".png";

    let message = "";
    if (yourSum > 21) {
        message = "패배";
    } else if (dealerSum > 21) {
        message = "승리";
    } else if (yourSum == dealerSum) {
        message = "무승부";
    } else if (yourSum > dealerSum) {
        message = "승리";
    } else if (yourSum < dealerSum) {
        message = "패배";
    }

    dealerSumDisplay.innerText = dealerSum;
    yourSumDisplay.innerText = yourSum;
    resultsDisplay.innerText = message;

    endRound(message);
}
function endRound(result) {
    // 라운드 결과를 기록
    roundResults.push(`라운드 ${round}: ${result}`);
    round++;

    // 사용자와 딜러의 합에서 Ace를 처리
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    // 딜러의 숨겨진 카드를 공개
    hiddenCardImage.src = "/team2/img/cards/" + hidden + ".png";

    let message = "";
    if (yourSum > 21) {
        message = "패배";
    } else if (dealerSum > 21) {
        message = "승리";
    } else if (yourSum == dealerSum) {
        message = "무승부";
    } else if (yourSum > dealerSum) {
        message = "승리";
    } else if (yourSum < dealerSum) {
        message = "패배";
    }

    // 결과를 화면에 업데이트
    dealerSumDisplay.innerText = dealerSum;
    yourSumDisplay.innerText = yourSum;
    resultsDisplay.innerText = message;
    nextRoundButton.style.display = "block";
    hitButton.style.display = "none";
    standButton.style.display = "none";
    if (result === "승리") {
        userMoney += 2 * userBet;
    } else if (result === "무승부") {
        userMoney += userBet;
    }

    // 사용자의 베팅 금액 초기화
    userBet = 0;

    // 사용자의 금액을 업데이트하고 베팅 관련 요소 리셋
    userMoneyDisplay.innerText = userMoney;
    betInput.value = "";
    document.getElementById("place-bet").disabled = false;

    // 라운드 결과 업데이트
    updateRoundHistory();

    // 사용자의 돈이 0이면 게임 오버 처리
    if (userMoney <= 0 || round > 5) {
        // 5라운드가 종료되었을 때 또는 사용자 돈이 0일 때
        resultsDisplay.innerText = "GAME OVER";
        nextRoundButton.style.display = "none"; // 다음 라운드 버튼 숨기기
        restartButton.style.display = "block"; // 다시하기 버튼 표시
    }
}

function endGame() {
    // Hit 및 Stand 버튼 비활성화
    hitButton.disabled = true;
    standButton.disabled = true;

    // 게임 초기화
    round = 1;
    roundResults = [];
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;

    // 사용자의 금액과 베팅 관련 요소 초기화
    userMoney = 100;
    userBet = 0;
    userMoneyDisplay.innerText = userMoney;
    betInput.value = "";
    document.getElementById("place-bet").disabled = false;

    // 라운드 결과 목록 초기화
    roundResultsList.innerHTML = "";

    // 게임 관련 요소 초기화
    roundNumberDisplay.innerText = round;
    dealerSumDisplay.innerText = "";
    yourSumDisplay.innerText = "";
    resultsDisplay.innerText = "";
    hiddenCardImage.src = "/team2/img/cards/BACK.png";
    yourCardsDisplay.innerHTML = "";
    dealerCardsDisplay.innerHTML = "";
    nextRoundButton.style.display = "none";
    restartButton.style.display = "none";
    hitButton.disabled = false;
    standButton.disabled = false;

    buildDeck();
    shuffleDeck();
    startGame();
}

function returnToDeck() {
    deck.push(hidden);

    const yourCards = yourCardsDisplay.querySelectorAll("img");
    const dealerCards = dealerCardsDisplay.querySelectorAll("img");

    yourCards.forEach((cardImg) => {
        const cardFileName = cardImg.src.split("/").pop();
        const cardName = cardFileName.split(".")[0];
        deck.push(cardName);
    });

    dealerCards.forEach((cardImg) => {
        const cardFileName = cardImg.src.split("/").pop();
        const cardName = cardFileName.split(".")[0];
        deck.push(cardName);
    });

    shuffleDeck();
}

function updateRoundHistory() {
    roundResultsList.innerHTML = "";
    for (let i = 0; i < roundResults.length; i++) {
        const listItem = document.createElement("li");
        listItem.textContent = roundResults[i];
        roundResultsList.appendChild(listItem);
    }
}

function restartGame() {
    round = 1;
    roundResults = [];
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;
    userMoney = 100;

    roundResultsList.innerHTML = "";

    roundNumberDisplay.innerText = round;
    dealerSumDisplay.innerText = "";
    yourSumDisplay.innerText = "";
    resultsDisplay.innerText = "";
    hiddenCardImage.src = "/team2/img/cards/BACK.png";
    yourCardsDisplay.innerHTML = "";
    dealerCardsDisplay.innerHTML = "";
    nextRoundButton.style.display = "none";
    userMoneyDisplay.innerText = userMoney;
    restartButton.style.display = "none";
    betInfo.style.display = "block";
    hitButton.disabled = false;
    standButton.disabled = false;

    buildDeck();
    shuffleDeck();
    startGame();
}

function getValue(card) {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) {
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

document.getElementById("restart").addEventListener("click", restartGame);

// 5라운드가 종료될 때 "저장" 버튼을 활성화
if (round > 5) {
    document.getElementById("saveButton").style.display = "block";
}

// 저장 버튼 클릭 이벤트 핸들러
saveButton.addEventListener("click", function () {
    // 서버 엔드포인트 URL
    const serverUrl = "/team2/point-infos"; // 서버에 점수를 저장하는 엔드포인트 경로

    // 5라운드 종료 시의 점수를 userMoney으로 설정
    const finalScore = userMoney;

    // 서버에서 uiNum 가져오기
    // 세션 uiNum 사용하도록 수정 23.12.20 최재환
    if (uiNum) {
        // 세션에서 가져온 uiNum을 사용할 수 있음
        // console.log("uiNum:", uiNum);

        // giNum
        const giNum = 9;

        // 서버에 보낼 데이터 객체 생성 (JSON 형식)
        const point = {
            uiNum: uiNum,
            giNum: giNum,
            piPoint: finalScore
        };

        // 출력: 서버로 보내는 데이터를 콘솔에 출력
        console.log("보내는 데이터:", point);

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
    } else {
        console.log("세션에 사용자 정보가 없습니다.");
    }
});
