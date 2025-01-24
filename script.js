let perguntas = [];
let perguntasRespondidas = 0;
let respostasCorretas = 0;

async function carregarPerguntas() {
    try {
        // Faz a requisição do arquivo JSON
        const response = await fetch('perguntas.json');
        perguntas = await response.json(); // Converte o JSON para um array de objetos
        
        inicializarProgresso(); // Configura a barra de progresso
        carregarPergunta(); // Carrega a primeira pergunta
    } catch (error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }
}

function inicializarProgresso() {
    const barraProgresso = document.getElementById('barra-progresso');
    barraProgresso.innerHTML = ''; // Limpa progresso anterior
    for (let i = 0; i < 5; i++) {
        const quadrado = document.createElement('div');
        quadrado.classList.add('quadrado');
        barraProgresso.appendChild(quadrado);
    }
}

function carregarPergunta() {
    if (perguntasRespondidas >= 5) {
        // Se o jogador já respondeu 5 perguntas, finaliza o quiz
        document.getElementById('pergunta').textContent = 
            `Fim do quiz! Você respondeu ${respostasCorretas} de 5 perguntas corretamente. Obrigado por jogar!`;
        document.getElementById('respostas').innerHTML = ''; // Remove os botões de resposta
        document.getElementById('botao-proxima').style.display = 'none'; // Esconde o botão "Próxima"
        return;
    }

    const indiceAleatorio = Math.floor(Math.random() * perguntas.length);
    const perguntaSelecionada = perguntas[indiceAleatorio];

    // Remove a pergunta do array para evitar repetição
    perguntas.splice(indiceAleatorio, 1);

    document.getElementById('pergunta').textContent = perguntaSelecionada.pergunta;

    const respostasContainer = document.getElementById('respostas');
    respostasContainer.innerHTML = ''; // Limpa respostas anteriores
    perguntaSelecionada.respostas.forEach(resposta => {
        const btn = document.createElement('button');
        btn.textContent = resposta;
        btn.onclick = () => verificarResposta(resposta, perguntaSelecionada.correta);
        respostasContainer.appendChild(btn);
    });

    // Esconde o botão "Próxima" até que o usuário responda a pergunta
    document.getElementById('botao-proxima').style.display = 'none';

    // Limpa a mensagem de feedback
    const texto = document.querySelector("p.txt");
    texto.textContent = '';
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

    // Exibe o botão "Próxima" após a resposta
    document.getElementById('botao-proxima').style.display = 'block';
}

function atualizarProgresso(respostaCorreta) {
    const quadrados = document.querySelectorAll('.quadrado');
    const quadradoAtual = quadrados[perguntasRespondidas]; // Baseado no índice da pergunta atual

    // Atualiza o progresso somente quando o botão "Próxima" for clicado
    if (respostaCorreta) {
        quadradoAtual.classList.add('correto');
    } else {
        quadradoAtual.classList.add('errado');
    }
}

function carregarProximaPergunta() {
    perguntasRespondidas++; // Incrementa o contador de perguntas respondidas
    carregarPergunta(); // Carrega a próxima pergunta
}

window.onload = carregarPerguntas; // Inicia carregando as perguntas do JSON
