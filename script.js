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
    if (perguntasRespondidas >= 5) {
        
        document.getElementById('pergunta').textContent = 
            `Fim do quiz! Você respondeu ${respostasCorretas} de 5 perguntas corretamente. Obrigado por jogar!`;
        document.getElementById('respostas').innerHTML = ''; 
        return;
    }

    const indiceAleatorio = Math.floor(Math.random() * perguntas.length);
    const perguntaSelecionada = perguntas[indiceAleatorio];

    
    perguntas.splice(indiceAleatorio, 1);

    document.getElementById('pergunta').textContent = perguntaSelecionada.pergunta;

    const respostasContainer = document.getElementById('respostas');
    respostasContainer.innerHTML = ''; 

    botaoRespostas = []; 

    perguntaSelecionada.respostas.forEach(resposta => {
        const btn = document.createElement('button');
        btn.textContent = resposta;
        btn.onclick = () => verificarResposta(resposta, perguntaSelecionada.correta);
        respostasContainer.appendChild(btn);
        botaoRespostas.push(btn);
    });

    habilitarBotoes(true);

    document.querySelector("p.txt").textContent = '';
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

    
    habilitarBotoes(false);

    document.getElementById('botao-proxima').style.display = 'block'; 
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
    
    document.querySelector("p.txt").textContent = '';

    document.getElementById('botao-proxima').style.display = 'none'; 
    carregarPergunta(); 
}

window.onload = carregarPerguntas; 
