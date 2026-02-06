// ELEMENTOS DE CONTROLE DO CHAT
const buttonChat = document.getElementById("buttonChat");
const paginaChat = document.getElementById("paginaChat");
const fecharChat = document.getElementById("fecharChat");
const input = document.getElementById("inputMensagem");
const botaoEnviar = document.getElementById("btnEnviar");
const chatBody = document.getElementById("chatBody");

// Identificador único para a sessão do usuário
const id_usuário = Math.random();

// FUNÇÃO PARA ABRIR/FECHAR
buttonChat.addEventListener("click", () => {
    paginaChat.style.display = "flex"; // Alterado para flex para manter a estrutura
});

fecharChat.addEventListener("click", () => {
    paginaChat.style.display = "none";
});

// FUNÇÃO PRINCIPAL DE ENVIO
async function enviarMensagem() {
    const texto = input.value.trim();
    if (texto === "") return;

    // 1. Adicionar mensagem do usuário na tela
    chatBody.innerHTML += `
        <div class="mensagem-env">
            <div class="bolha">
                <p><strong>Você:</strong> ${texto}</p>
            </div>
        </div>
    `;

    chatBody.scrollTop = chatBody.scrollHeight;
    input.value = "";

    // 2. Criar o indicador de "digitando" com ID único
    const loadingId = "loading-" + Date.now();
    const loadingHtml = `
        <div class="mensagem-rcb" id="${loadingId}">
            <img class="avatar" src="assets/avatar.png" alt="Avatar">
            <div class="bolha">
                <div class="digitando">
                    <div class="ponto"></div>
                    <div class="ponto"></div>
                    <div class="ponto)</div>
                </div>
            </div>
        </div>
    `;
    chatBody.innerHTML += loadingHtml;
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
        // 3. Enviar para o seu Webhook (n8n)
        const resp = await fetch("https://n8n.vps.eniacacademy.com.br/webhook/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: texto, id: id_usuário })
        });

        const data = await resp.json();

        // 4. Remover o indicador de carregamento após a resposta
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) loadingElement.remove();

        // 5. Exibir a resposta oficial do Assistente
        chatBody.innerHTML += `
            <div class="mensagem-rcb">
                <img class="avatar" src="assets/avatar.png" alt="Avatar">
                <div class="bolha">
                    <p><strong>Assistente RH:</strong> ${data.output}</p>
                    <span class="time">Agora</span>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Erro na requisição:", error);
        // Remove o carregando mesmo se der erro para não travar a tela
        document.getElementById(loadingId)?.remove();
    }

    chatBody.scrollTop = chatBody.scrollHeight;
}

// EVENTOS DE ENVIO
botaoEnviar.addEventListener("click", enviarMensagem);
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") enviarMensagem();
});