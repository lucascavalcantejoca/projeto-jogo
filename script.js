let perguntas = [];
let perguntasRespondidas = 0;
let respostasCorretas = 0;
let botaoRespostas = [];

async function carregarPerguntas() {
    try {
        const response = await fetch('perguntas.json');
        perguntas = await response.json(); 
        
        inicializarProgresso(); 
        carregarPergunta(); 
    } catch (error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }
}

async function obterGifDeGato() {
    try {
        const resposta = await fetch('https://api.thecatapi.com/v1/images/search');
        const dados = await resposta.json();
        const gifUrl = dados[0].url;

        exibirGif(gifUrl);
    } catch (error) {
        console.error('Erro ao obter o gif do gato:', error);
    }
}

function exibirGif(url) {
    const gifContainer = document.getElementById('gif-container');
    gifContainer.innerHTML = ` 
        <h2>Parabéns! Você acertou todas as questões!</h2>
        <img src="${url}" alt="Gif de Gato" style="width: 100%; max-width: 500px; border-radius: 10px;">
    `;
}

function inicializarProgresso() {
    const barraProgresso = document.getElementById('barra-progresso');
    barraProgresso.innerHTML = ''; 
    for (let i = 0; i < 5; i++) {
        const quadrado = document.createElement('div');
        quadrado.classList.add('quadrado');
        barraProgresso.appendChild(quadrado);
    }
}

function carregarPergunta() {
    // Se todas as perguntas foram respondidas, mostrar a mensagem de fim de quiz
    if (perguntasRespondidas >= 5) {
        document.getElementById('pergunta').textContent = 
            `Fim do quiz! Você respondeu ${respostasCorretas} de 5 perguntas corretamente. Obrigado por jogar!`;
        document.getElementById('respostas').innerHTML = ''; 
        habilitarBotoes(false);
        document.querySelector('div#respostas').style.display = 'none';

        if (respostasCorretas === 5) {
            obterGifDeGato(); // Só chamar o gif se o usuário acertou todas as questões
        }
        return;
    }

    // Seleção aleatória da pergunta
    const indiceAleatorio = Math.floor(Math.random() * perguntas.length);
    const perguntaSelecionada = perguntas[indiceAleatorio];
    
    // Remover a pergunta da lista para evitar repetições
    perguntas.splice(indiceAleatorio, 1);

    document.getElementById('pergunta').textContent = perguntaSelecionada.pergunta;

    const respostasContainer = document.getElementById('respostas');
    respostasContainer.innerHTML = ''; 

    botaoRespostas = []; 

    // Criar os botões de resposta
    perguntaSelecionada.respostas.forEach(resposta => {
        const btn = document.createElement('button');
        btn.textContent = resposta;
        btn.onclick = () => verificarResposta(resposta, perguntaSelecionada.correta);
        respostasContainer.appendChild(btn);
        botaoRespostas.push(btn);
    });

    habilitarBotoes(true);

    document.querySelector("p.txt").textContent = ''; // Limpar o feedback da resposta anterior
}

function verificarResposta(respostaSelecionada, respostaCorreta) {
    const texto = document.querySelector("p.txt");

    if (respostaSelecionada === respostaCorreta) {
        respostasCorretas++;
        texto.textContent = 'Resposta correta!';
        atualizarProgresso(true);
    } else {
        texto.textContent = `Resposta errada! A resposta certa era: ${respostaCorreta}`;
        atualizarProgresso(false);
    }

    perguntasRespondidas++;

    habilitarBotoes(false); // Desabilitar os botões após a resposta
    document.getElementById('botao-proxima').style.display = 'block'; // Exibir botão "Próxima"
}

function habilitarBotoes(estado) {
    botaoRespostas.forEach(botao => {
        botao.disabled = !estado;
    });
}

function atualizarProgresso(respostaCorreta) {
    const quadrados = document.querySelectorAll('.quadrado');
    const quadradoAtual = quadrados[perguntasRespondidas]; 

    if (respostaCorreta) {
        quadradoAtual.classList.add('correto');
    } else {
        quadradoAtual.classList.add('errado');
    }
}

function carregarProximaPergunta() {
    // Limpar o texto de feedback e ocultar o botão "Próxima"
    document.querySelector("p.txt").textContent = '';
    document.getElementById('botao-proxima').style.display = 'none'; 
    
    // Carregar a próxima pergunta
    carregarPergunta(); 
}

window.onload = carregarPerguntas;
