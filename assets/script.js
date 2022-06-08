// para selecionar todos os cards
const cards = document.querySelectorAll('.card');

let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;


// para adicionar a palavra flip no card que for clicado
function flipCard() {
    if (lockBoard) return;
    // não deixar o mesmo card ser clicado duas vezes ao mesmo tempo
    if (this === firstCard) return;
    this.classList.add('flip');
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    secondCard = this;
    hasFlippedCard = false;
    checkForMatch();
}

function checkForMatch() {
    if (firstCard.dataset.card === secondCard.dataset.card) {
        // caso os cards sejam iguais
        disableCards();
        return;
    }
    // caso os cards não sejam iguais
    unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// embaralhar os cards através de uma função imediata
(function shuffle() {
    cards.forEach((card) => {
        let ramdonPosition = Math.floor(Math.random() * 18);
        card.style.order = ramdonPosition;
    })
})();

cards.forEach((card) => {
    card.addEventListener('click', flipCard)
})


/* adaptação do código idealizado por 
Tarso Galvão Github: https://github.com/surtarso/javaScript-Projects para trocar o tema do jogo */
const temasButton = document.getElementsByClassName('temas-button')[0];
const resetButton = document.getElementsByClassName('reset-button')[0];

const maxPares = 9; //maximo de pares possiveis
const cardFace = document.querySelectorAll('.card-front');
const cardBack = document.querySelectorAll('.card-back');
let travaClick = false; //nao deixar virar mais cartas
let temas = ['img_theme1', 'img_theme2']; //nome das pastas dos temas
let current = 0; //posicao na array de temas

//função para reinicar o tema atual do jogo
function resetTheme() {
    // remover a classe flip
    cards.forEach((card) => {
        card.classList.remove('flip');
        card.style.scale = 1;
    });
    //espera as cartas desvirarem para embaralhar
    setTimeout(() => {
        //embaralha as cartas e adiciona evento de click
        cards.forEach((card) => {
            let randomPosition = Math.floor(Math.random() * (maxPares * 2));
            card.style.order = randomPosition;
            card.addEventListener('click', flipCard);
        });
    }, 500);
    // reativa o mouse click e reseta cartas clicadas
    resetBoard();
}

resetButton.addEventListener('click', resetTheme);


//função para trocar o tema do jogo
function changeTheme() {
    if(travaClick) return; //espera erros desvirarem para nao bugar o timeout
    // reiniciar o tema
    resetTheme();
    //anda no array de temas
    current++;
    //volta ao inicio da array se chegar ao fim
    if (current == temas.length){
        current = 0
    };
    //seta o diretorio do tema atual na variavel tema
    let tema = temas[current];
    //seta metadata na imagem para troca em tempo real
    let i = 1;
    //aplica a imagem nas cartas (frente)
    cardFace.forEach(cardface => {
        cardface.src = `assets/${tema}/image${i}.jpg`;
        i++;
        //repete a numeracao no segundo set de cartas iguais (pares de cartas)
        if (i > maxPares) {
            i = 1;
        }
    });
    //aplica a imagem nas cartas (verso)
    cardBack.forEach(cardback => {
        cardback.src = `assets/${tema}/box.png`;
    });
}

temasButton.addEventListener('click', changeTheme);