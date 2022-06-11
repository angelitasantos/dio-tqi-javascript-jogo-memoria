// para selecionar o elemento por sua classe
const selector = (elemento) => document.querySelector(elemento);
const selectorAll = (elemento) => document.querySelectorAll(elemento);

// para saber o tamanho da tela do usuário
var screenSize = window.innerWidth;
var maxPairs = 9; //maximo de pares possiveis
var addAttempts = 3;

// para selecionar todos os cards
const cards = document.querySelectorAll('.card');
const mobile = document.querySelectorAll('.mobile');

let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;

// trocar temas e reiniciar
const themeButton = document.getElementsByClassName('temas-button')[0];
const resetButton = document.getElementsByClassName('reset-button')[0];
const cardFace = document.querySelectorAll('.card-front');
const cardBack = document.querySelectorAll('.card-back');
let lockClick = false; //nao deixar virar mais cartas
let themes = ['img_theme1', 'img_theme2']; //nome das pastas dos temas
let current = 0; //posicao na array de temas

// acertos e erros
let numeroAcertos = 0;
let numeroErros = 0;


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
    checkWin();
}

//função que checa se as cartas são iguais
function checkForMatch() {
    if (firstCard.dataset.card === secondCard.dataset.card) {
        // caso os cards sejam iguais
        disableCards();
        return;
    }
    // caso os cards não sejam iguais
    unflipCards();
}

//função de acerto de pares
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    numeroAcertos += 1;
    resetBoard();
}

//funcão que desvira as cartas
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        numeroErros += 1;
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// embaralhar os cards através de uma função imediata
(function shuffle() {
    // reseta numero de erros e acertos
    numeroAcertos = 0;
    numeroErros = 0;
    if (screenSize < 700) {
        mobile.forEach((mobile) => {
            maxPairs = 6;
            let ramdonPosition = Math.floor(Math.random() * (maxPairs * 2));
            mobile.style.order = ramdonPosition;
            let allAttempts = maxPairs + addAttempts;
            selector('.good-luck').innerHTML = `Você tem ${allAttempts} tentativas. Boa Sorte. Divirta-se.`;
        })
    } else {
        cards.forEach((card) => {
            let ramdonPosition = Math.floor(Math.random() * (maxPairs * 2));
            card.style.order = ramdonPosition;
            let allAttempts = maxPairs + addAttempts;
            selector('.good-luck').innerHTML = `Você tem ${allAttempts} tentativas. Boa Sorte. Divirta-se.`;
        })
    }
})();

cards.forEach((card) => {
    card.addEventListener('click', flipCard)
})

//função para reinicar o tema atual do jogo
function resetTheme() {
    // reseta numero de erros e acertos
    numeroAcertos = 0;
    numeroErros = 0;
    // remover a classe flip
    cards.forEach((card) => {
        card.classList.remove('flip');
        card.style.scale = 1;
    });
    //espera as cartas desvirarem para embaralhar
    setTimeout(() => {
        //embaralha as cartas e adiciona evento de click
        if (screenSize < 700) {
            mobile.forEach((mobile) => {
                maxPairs = 6;
                let ramdonPosition = Math.floor(Math.random() * (maxPairs * 2));
                mobile.style.order = ramdonPosition;
                mobile.addEventListener('click', flipCard);
            })
        } else {
            cards.forEach((card) => {
                let randomPosition = Math.floor(Math.random() * (maxPairs * 2));
                card.style.order = randomPosition;
                card.addEventListener('click', flipCard);
            });
        }
    }, 500);
    // reativa o mouse click e reseta cartas clicadas
    resetBoard();
}

resetButton.addEventListener('click', resetTheme);


//função para trocar o tema do jogo
function changeTheme() {
    if(lockClick) return; //espera erros desvirarem para nao bugar o timeout
    // reiniciar o tema
    resetTheme();
    //anda no array de temas
    current++;
    //volta ao inicio da array se chegar ao fim
    if (current == themes.length){
        current = 0
    };
    //seta o diretorio do tema atual na variavel tema
    let tema = themes[current];
    //seta metadata na imagem para troca em tempo real
    let i = 1;
    //aplica a imagem nas cartas (frente)
    cardFace.forEach(cardface => {
        cardface.src = `assets/${tema}/image${i}.jpg`;
        i++;
        //repete a numeracao no segundo set de cartas iguais (pares de cartas)
        if (screenSize < 700) {
            maxPairs = 9;
            if (i > maxPairs) {
                i = 1;
            }
        } else if (i > maxPairs) {
            i = 1;
        }
    });
    //aplica a imagem nas cartas (verso)
    cardBack.forEach(cardback => {
        cardback.src = `assets/${tema}/box.png`;
    });
}

themeButton.addEventListener('click', changeTheme);

function openModal() {
    selector('.dialogWindowArea').style.opacity = 0;
    selector('.dialogWindowArea').style.display = 'flex';
    selector('.dialogCancelButton').innerHTML = 'Fechar';
    setTimeout(() => {
        selector('.dialogWindowArea').style.opacity = 1;
    }, 200);
}

function closeModal() {
    selector('.dialogWindowArea').style.opacity = 0;
    setTimeout(() => {
        selector('.dialogWindowArea').style.display = 'none';
    }, 500);
    resetTheme();
}

selector('.dialogCancelButton').addEventListener('click', closeModal);

function checkWin() {
    if ((screenSize < 700 && numeroAcertos == 6) || (screenSize >= 700 && numeroAcertos == maxPairs)) {
        selector('.dialogHeader').style.background = 'green';
        selector('.dialogHeader').style.color = 'white';
        selector('.dialogTitle').innerHTML = 'Você Ganhou !!!';
        selector('.dialogSubtitle').innerHTML = 'Que Legal!!!';
        selector('.dialogMessage').innerHTML = `Você errou ${numeroErros} tentativas, mas acertou todos os cards.`;
        cards.forEach((card) => {
            card.classList.add('flip');
        });
        openModal();
    } else if (numeroErros == (maxPairs + addAttempts - 1)) {
        let allAttempts = maxPairs + addAttempts;
        selector('.dialogHeader').style.background = 'red';
        selector('.dialogHeader').style.color = 'white';
        selector('.dialogTitle').innerHTML = 'Você Perdeu !!!';
        selector('.dialogSubtitle').innerHTML = 'Que Pena!!!';
        selector('.dialogMessage').innerHTML = `Você errou as ${allAttempts} tentativas.`;
        cards.forEach((card) => {
            card.classList.add('flip');
        });
        openModal();
    }
}