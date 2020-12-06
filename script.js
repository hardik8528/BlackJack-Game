
let data = {
    "you": { "ScoreSpan": "#Your-Result", "div": "#Your-Box", "Score": 0 },
    "dealer": { "ScoreSpan": "#Dealer-Result", "div": "#Dealer-Box", "Score": 0 },
    "cards": ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'J', 'K', 'Q'],
    "cardValue": { "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "J": 10, "K": 10, "Q": 10, "A": [1, 11] },
    "wins": 0,
    "losses": 0,
    "draws": 0,
    "isStand": false,
    "turnOver": false,
}

const YOU = data["you"];
const DEALER = data["dealer"];

let hitSound = new Audio("./BlackJack/sound/swish.m4a");
let WinSound = new Audio("./BlackJack/sound/cash.mp3");
let LossSound = new Audio("./BlackJack/sound/aww.mp3");

document.querySelector("#hit").addEventListener("click", blackjackHit);

document.querySelector("#deal").addEventListener("click", blackjackDeal);

document.querySelector("#stand").addEventListener("click", blackjackStand);

function blackjackHit() {
    if (data['isStand'] == false) {
        let card = randomCard();
        Show(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
}

function randomCard() {
    let random = Math.floor(Math.random() * 13);
    return data['cards'][random];
}

function Show(card, activePlayer) {
    if (activePlayer['Score'] <= 21) {
        let SendImage = document.createElement("img");
        SendImage.src = `./BlackJack/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(SendImage);
        hitSound.play();
    }
}

function blackjackDeal() {
    if (data['turnOver'] = true) {
        data['isStand'] = false;
        let yourImage = document.querySelector("#Your-Box").querySelectorAll('img');

        let dealerImage = document.querySelector("#Dealer-Box").querySelectorAll('img');

        for (let i = 0; i < yourImage.length; i++) {
            yourImage[i].remove();
        }

        for (let i = 0; i < dealerImage.length; i++) {
            dealerImage[i].remove();
        }

        YOU['Score'] = 0;
        DEALER['Score'] = 0;

        document.querySelector('#Your-Result').textContent = 0;
        document.querySelector('#Dealer-Result').textContent = 0;

        document.querySelector('#Your-Result').style.color = '#FFFFFF';
        document.querySelector('#Dealer-Result').style.color = '#FFFFFF';

        document.querySelector('#Main-Result').textContent = "Let's Play";
        document.querySelector('#Main-Result').style.color = "black";

        data['turnOver'] = true;
    }
}

function updateScore(card, activePlayer) {
    // id score + 11 is less than or equal 21 the value of 'A' will be count as 11 otherwise count as 1
    if (card == 'A') {
        if (activePlayer['Score'] + data['cardValue'][card][1] <= 21) {
            activePlayer['Score'] += data['cardValue'][card][1];
        } else {
            activePlayer['Score'] += data['cardValue'][card][0];
        }
    } else {
        activePlayer['Score'] += data['cardValue'][card];
    }

}

function showScore(activePlayer) {
    if (activePlayer['Score'] <= 21) {
        document.querySelector(activePlayer['ScoreSpan']).textContent = activePlayer['Score'];
    } else {
        document.querySelector(activePlayer['ScoreSpan']).textContent = "Bust!"
        document.querySelector(activePlayer['ScoreSpan']).style.color = "red"
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function blackjackStand() {

    data['isStand'] = true;
    while (DEALER['Score'] < 16 && data['isStand'] == true) {
        let card = randomCard();
        Show(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(750);
    }
    data['turnOver'] = true;
    let winner = ComputeWinner();
    ShowResult(winner);

}

function ComputeWinner() {
    let winner;
    if (YOU['Score'] <= 21) {
        if (YOU['Score'] > DEALER['Score'] || DEALER['Score'] > 21) {
            winner = YOU;
            data['wins']++;
        } else if (YOU['Score'] < DEALER['Score']) {
            winner = DEALER;
            data['losses']++;
        } else if (YOU['Score'] == DEALER['Score']) {
            data['draws']++;
        }
    } else if (YOU['Score'] > 21 && DEALER['Score'] <= 21) {
        winner = DEALER;
        data['losses']++;
    } else if (YOU['Score'] > 21 && DEALER['Score'] > 21) {
        data['draws']++;
    }

    console.log('Winner is', winner);
    return winner;
}

function ShowResult(winner) {
    let message, messageColor;
    if (data['turnOver'] == true) {

        if (winner == YOU) {
            document.querySelector('#wins').textContent = data['wins'];
            message = 'You Won!';
            messageColor = 'green';
            WinSound.play();
        } else if (winner == DEALER) {
            document.querySelector('#losses').textContent = data['losses'];
            message = 'You Lost!';
            messageColor = 'red';
            LossSound.play();
        } else {
            document.querySelector('#draws').textContent = data['draws'];
            message = 'You Drew!';
            messageColor = 'black';
        }

        document.querySelector('#Main-Result').textContent = message;

        document.querySelector('#Main-Result').style.color = messageColor;
    }
}