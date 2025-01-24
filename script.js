let perguntas = [];
let perguntasRespondidas = 0;
let respostasCorretas = 0;
let respostaVerificada = false; // Controla se a resposta foi verificada

async function carregarPerguntas() {
    try {
        const response = await fetch('perguntas.json');
        perguntas = await response.json(); // Converte o JSON para um array de objetos
        carregarPergunta(); // Carrega a primeira pergunta
    } catch (error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }
}

function carregarPergunta() {
    if (perguntasRespondidas >= 5) {
        // Se o jogador já respondeu 5 perguntas, finaliza o quiz
        document.getElementById('pergunta').textContent = 
            `Fim do quiz! Você respondeu ${respostasCorretas} perguntas corretamente. Obrigado por jogar!`;
        document.getElementById('respostas').innerHTML = ''; // Remove os botões de resposta
        document.getElementById('botao-proxima').style.display = 'none'; // Esconde o botão "Próxima"
        return;
    }

    const indiceAleatorio = Math.floor(Math.random() * perguntas.length);
    const perguntaSelecionada = perguntas[indiceAleatorio];

    perguntas.splice(indiceAleatorio, 1); // Remove a pergunta do array para evitar repetição

    document.getElementById('pergunta').textContent = perguntaSelecionada.pergunta;

    const respostasContainer = document.getElementById('respostas');
    respostasContainer.innerHTML = ''; // Limpa respostas anteriores
    perguntaSelecionada.respostas.forEach(resposta => {
        const btn = document.createElement('button');
        btn.textContent = resposta;
        btn.onclick = () => verificarResposta(resposta, perguntaSelecionada.correta);
        respostasContainer.appendChild(btn);
    });

    // Esconde o botão "Próxima" até que a resposta atual seja verificada
    document.getElementById('botao-proxima').style.display = 'none';

    respostaVerificada = false; // Reseta o estado de verificação para a nova pergunta

    // Limpa a mensagem de feedback ao carregar a nova pergunta
    document.querySelector("p.txt").textContent = '';
}

function verificarResposta(respostaSelecionada, respostaCorreta) {
    const texto = document.querySelector("p.txt");

    if (respostaVerificada) {
        return; // Impede que o jogador clique várias vezes e altere o estado
    }

    if (respostaSelecionada === respostaCorreta) {
        respostasCorretas++; // Incrementa as respostas corretas
        texto.textContent = 'Resposta correta!';
    } else {
        texto.textContent = `Resposta errada! A resposta certa era: ${respostaCorreta}`;
    }

    respostaVerificada = true; // Marca que a resposta foi verificada
    document.getElementById('botao-proxima').style.display = 'block'; // Exibe o botão "Próxima"
}

function carregarProximaPergunta() {
    perguntasRespondidas++; // Incrementa o contador de perguntas respondidas
    const progresso = document.querySelector("p.progresso");
    progresso.textContent = `Progresso: ${perguntasRespondidas}/5`;

    carregarPergunta(); // Carrega a próxima pergunta
}

window.onload = carregarPerguntas; // Inicia carregando as perguntas do JSON
