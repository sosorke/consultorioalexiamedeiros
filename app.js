const links = document.querySelectorAll("nav a");
const paginaAtual = window.location.pathname.split("/").pop() || "index.html";

links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === paginaAtual) {
        link.classList.add("active");
    }
});

const horariosFixos = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
const agendamentoForm = document.querySelector("#agendamento-form");

if (agendamentoForm) {
    const dataInput = document.querySelector("#data");
    const horarioSelect = document.querySelector("#horario");
    const horariosInfo = document.querySelector("#horarios-info");
    const statusBox = document.querySelector("#mensagem-status");
    const hoje = new Date().toISOString().split("T")[0];

    dataInput.min = hoje;

    const carregarAgendamentos = () => {
        try {
            return JSON.parse(localStorage.getItem("clinica_agendamentos")) || [];
        } catch {
            return [];
        }
    };

    const salvarAgendamentos = (agendamentos) => {
        localStorage.setItem("clinica_agendamentos", JSON.stringify(agendamentos));
    };

    const atualizarHorarios = () => {
        const dataSelecionada = dataInput.value;
        horarioSelect.innerHTML = '<option value="">Selecione um horário</option>';
        statusBox.textContent = "";
        statusBox.className = "mensagem-status";

        if (!dataSelecionada) {
            horariosInfo.textContent = "Escolha uma data para ver os horários disponíveis.";
            return;
        }

        const agendamentos = carregarAgendamentos();
        const ocupados = agendamentos
            .filter((item) => item.data === dataSelecionada)
            .map((item) => item.horario);
        const disponiveis = horariosFixos.filter((horario) => !ocupados.includes(horario));

        if (disponiveis.length === 0) {
            horariosInfo.textContent = "Não há horários disponíveis para esta data.";
            return;
        }

        disponiveis.forEach((horario) => {
            const option = document.createElement("option");
            option.value = horario;
            option.textContent = horario;
            horarioSelect.appendChild(option);
        });

        horariosInfo.textContent = `Horários disponíveis em ${dataSelecionada}: ${disponiveis.join(", ")}.`;
    };

    dataInput.addEventListener("change", atualizarHorarios);

    agendamentoForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const nome = document.querySelector("#nome").value.trim();
        const telefone = document.querySelector("#telefone").value.trim();
        const data = dataInput.value;
        const horario = horarioSelect.value;
        const crianca = document.querySelector("#crianca").checked;

        if (!data || !horario) {
            statusBox.textContent = "Selecione a data e o horário antes de confirmar.";
            statusBox.className = "mensagem-status erro";
            return;
        }

        const agendamentos = carregarAgendamentos();
        const jaExiste = agendamentos.some((item) => item.data === data && item.horario === horario);

        if (jaExiste) {
            statusBox.textContent = "Esse horário acabou de ser reservado. Escolha outro.";
            statusBox.className = "mensagem-status erro";
            atualizarHorarios();
            return;
        }

        agendamentos.push({ nome, telefone, data, horario, crianca });
        salvarAgendamentos(agendamentos);

        sessionStorage.setItem("clinica_confirmacao", JSON.stringify({ nome, data, horario }));
        window.location.href = "confirmacao.html";
    });
}

const confirmacaoBox = document.querySelector("#confirmacao-detalhes");

if (confirmacaoBox) {
    const dados = sessionStorage.getItem("clinica_confirmacao");

    if (!dados) {
        confirmacaoBox.innerHTML = "Nenhum agendamento recente foi encontrado.";
    } else {
        const { nome, data, horario } = JSON.parse(dados);
        confirmacaoBox.innerHTML = `Obrigado, <strong>${nome}</strong>!<br>Sua consulta foi marcada para <strong>${data}</strong> às <strong>${horario}</strong>.`;
    }
}

const contatoForm = document.querySelector("#contato-form");

if (contatoForm) {
    const retornoContato = document.querySelector("#retorno-contato");

    contatoForm.addEventListener("submit", (event) => {
        event.preventDefault();
        contatoForm.reset();
        retornoContato.textContent = "Mensagem enviada com sucesso. Entraremos em contato em breve.";
        retornoContato.className = "mensagem-status sucesso";
    });
}

const loginForm = document.querySelector("#login-form");

if (loginForm) {
    const retornoLogin = document.querySelector("#retorno-login");

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        retornoLogin.textContent = "Área administrativa desativada nesta versão em HTML.";
        retornoLogin.className = "mensagem-status";
    });
}
