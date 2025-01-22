let perguntas = [];

async function carregarPerguntas() {
    try {
        // Faz a requisição do arquivo JSON
        const response = await fetch('perguntas.json');
        perguntas = await response.json(); // Converte o JSON para um array de objetos
        
        carregarPergunta(); // Carrega a primeira pergunta
    } catch (error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }
}

function carregarPergunta() {
    if (perguntas.length === 0) {
        // Se não houver mais perguntas, encerra o jogo
        document.getElementById('pergunta').textContent = "Fim do quiz! Obrigado por jogar!";
        document.getElementById('respostas').innerHTML = ''; // Remove os botões de resposta
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
}

function verificarResposta(respostaSelecionada, respostaCorreta) {
    if (respostaSelecionada === respostaCorreta) {
        alert('Resposta correta!');
    } else {
        alert('Resposta incorreta. A correta era: ' + respostaCorreta);
    }
    carregarPergunta(); // Nova pergunta
}

window.onload = carregarPerguntas; // Inicia carregando as perguntas do JSON
