const buttonChat = document.getElementById("buttonChat");
const paginaChat = document.getElementById("paginaChat");
const fecharChat = document.getElementById("fecharChat");

buttonChat.addEventListener("click", () => {
    paginaChat.style.display = "block";
});

fecharChat.addEventListener("click", () => {
    paginaChat.style.display = "none";
});

// ELEMENTOS
const input = document.getElementById("inputMensagem");
const botaoEnviar = document.getElementById("btnEnviar");
const chatBody = document.getElementById("chatBody");

const id_usuário = Math.random()

// ENVIAR MENSAGEM
async function enviarMensagem() {

    const texto = input.value.trim();
    if (texto === "") return;

    // Mensagem do usuário
    chatBody.innerHTML += `
        <div class="mensagem-env">
            <div class="bolha">
                <p><strong>Você:</strong> ${texto}</p>
            </div>
        </div>
    `;

    chatBody.scrollTop = chatBody.scrollHeight;
    input.value = "";

    // ENVIAR PARA O N8N
    const resp = await fetch("http://localhost:5678/webhook/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: texto, id: id_usuário })
    });

    const data = await resp.json();
    console.log(data)

    // Mensagem do bot
    chatBody.innerHTML += `
        <div class="mensagem-rcb">
            <div class="bolha">
                <p><strong>Assistente RH:</strong> ${data.output}</p>
            </div>
        </div>
    `;

    chatBody.scrollTop = chatBody.scrollHeight;
}

// ENVIAR AO CLICAR
botaoEnviar.addEventListener("click", enviarMensagem);

// ENVIAR COM ENTER
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") enviarMensagem();
});

document.addEventListener("DOMContentLoaded", function() {
    const buttonChat = document.getElementById("buttonChat");
    const paginaChat = document.getElementById("paginaChat");
    const fecharChat = document.getElementById("fecharChat");

    // Lógica para abrir o chat
    if (buttonChat) {
        buttonChat.addEventListener("click", () => {
            if (paginaChat) {
                paginaChat.style.display = "block";
            }
        });
    }

    // Lógica para fechar o chat
    if (fecharChat) {
        fecharChat.addEventListener("click", () => {
            if (paginaChat) {
                paginaChat.style.display = "none";
            }
        });
    }

    // ... o restante do seu código JavaScript (enviarMensagem, etc.)
});