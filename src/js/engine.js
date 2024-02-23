const state = {
    score:{
        playerScore : 0,
        computerScore : 0,
        scoreBox : document.querySelector('#score_points')
    },
    cardsSprites : {
        avatar : document.querySelector('#card-image'),
        name : document.querySelector('#card-name'),
        type : document.querySelector('#card-type')
    },
    playerSides : {
        player1 : "player-cards",
        playerBOX : document.querySelector('#player-cards'),
        computer : "computer-cards",
        computerBox : document.querySelector('#computer-cards')
    },
    fieldCards : {
        player : document.querySelector('#player-field-card'),
        computer : document.querySelector('#computer-field-card')
    },
    actions : {
        buttons : document.querySelector('#next-duel')
    }
};

const pathImages = './src/assets/icons/'

const cardData = [
    {
        id : 0,
        name : "Blue Eyes White Dragon",
        type : "Paper",
        img : `${pathImages}dragon.png`,
        winOf : [1],
        LoseOf : [2]
    },
    {
        id : 1,
        name : "Dark Magician",
        type : "Rock",
        img : `${pathImages}magician.png`,
        winOf : [2],
        LoseOf : [0]
    },
    {
        id : 2,
        name : "Exodia",
        type : "Scissor",
        img : `${pathImages}exodia.png`,
        winOf : [0],
        LoseOf : [1]
    }
]

async function getRamdomCardId(){
    const radomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[radomIndex].id;
}

async function createCardImage(idCard, fildSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px")
    cardImage.setAttribute("src", `${pathImages}card-back.png`);
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");

    if(fildSide === state.playerSides.player1){
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"))
        });

        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(idCard);
        })
    }

    return cardImage
}

async function setCardsField(cardId){
    await removeAllCardsImages();
    
    let computerCardId = await getRamdomCardId();

    await showHiddenCardFildImages(true);
    // state.fieldCards.player.style.display = "block";
    // state.fieldCards.computer.style.display = "block";

    await drawCardsInFilds(cardId, computerCardId)
    // state.fieldCards.player.src = cardData[cardId].img;
    // state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButtons(duelResults);
}

async function showHiddenCardFildImages(value){
    if(value){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block"; 
    }else{
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function drawCardsInFilds(playerCardId, computerCardId){
    state.fieldCards.player.src = cardData[playerCardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function removeAllCardsImages(){
    let { computerBox, playerBOX}  = state.playerSides;
    let imgElements = computerBox.querySelectorAll('img');
    imgElements.forEach((img) => img.remove())

    imgElements = playerBOX.querySelectorAll('img');
    imgElements.forEach((img) => img.remove())
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResult = "draw";
     let playerCard = cardData[playerCardId];

     if(playerCard.winOf.includes(computerCardId)){
        duelResult = "win";
        await playAudio(duelResult);
        state.score.playerScore++;
     }else if(playerCard.LoseOf.includes(computerCardId)){
        duelResult = "lose";
        await playAudio(duelResult);
        state.score.computerScore++;
     }

     return duelResult
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win : ${state.score.playerScore} | Lose : ${state.score.computerScore}`
}

async function drawButtons(duelResults){
    state.actions.buttons.innerText = duelResults;
    state.actions.buttons.style.display = "block";
}

async function drawSelectCard(index){
    state.cardsSprites.avatar.src = cardData[index].img;
    state.cardsSprites.name.innerText = cardData[index].name;
    state.cardsSprites.type.innerText = `Attrribute: ${cardData[index].type}`
}

async function drawCards(cardNumber, fildSide){
    for(let i = 0; i < cardNumber; i++){
        const ramdomIdCard = await getRamdomCardId();
        const cardImage = await createCardImage(ramdomIdCard, fildSide);

        console.log(fildSide)

        document.getElementById(fildSide).appendChild(cardImage);
    }
}

async function resetDuel(){
    state.cardsSprites.avatar.src = "";
    state.cardsSprites.name.innerText = "";
    state.cardsSprites.type.innerText = "";


    state.actions.buttons.style.display = "none";

    state.fieldCards.computer.style.display = "none";
    state.fieldCards.player.style.display = "none";

    init()
}

async function playAudio(status){
    let audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.volume = 0.1;
    audio.play();
}

function init(){
    showHiddenCardFildImages(false);
    // state.fieldCards.player.style.display = "none";
    // state.fieldCards.computer.style.display = "none";

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    const body = document.querySelector('body');
    body.addEventListener('mouseover', () => {
        const bgm = document.querySelector('#bgm');
        bgm.volume = 0.1;
        bgm.play();
    })
}

init();