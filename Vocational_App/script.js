const API_URL = "api/index.php";

let usuarioAtual = null;
let perguntas = []; 
let indicePergunta = 0;
let respostasQuiz = {};
let idEdicaoAtual = null; 

const MATRIZ_PROFISSOES = {
    "Exatas_Biológicas_Humanas_Artísticas": { titulo: "Engenheiro Biomédico", descricao: "Usa cálculo avançado para resolver problemas de saúde." },
    "Exatas_Biológicas_Artísticas_Humanas": { titulo: "Bioinformata", descricao: "Analisa dados genéticos complexos com algoritmos." },
    "Exatas_Humanas_Biológicas_Artísticas": { titulo: "Cientista de Dados", descricao: "Interpreta grandes volumes de dados para prever comportamentos sociais." },
    "Exatas_Humanas_Artísticas_Biológicas": { titulo: "Gestor de Tecnologia (CTO)", descricao: "Lidera equipes técnicas com visão de negócios e pessoas." },
    "Exatas_Artísticas_Biológicas_Humanas": { titulo: "Arquiteto Sustentável", descricao: "Projeta estruturas complexas integradas à natureza." },
    "Exatas_Artísticas_Humanas_Biológicas": { titulo: "Dev Front-end / UX", descricao: "Une lógica de programação com estética e experiência do usuário." },

    "Humanas_Exatas_Biológicas_Artísticas": { titulo: "Economista", descricao: "Analisa o comportamento da sociedade através de modelos matemáticos." },
    "Humanas_Exatas_Artísticas_Biológicas": { titulo: "Jurista Tributário", descricao: "Domina as leis com forte base lógica e argumentativa." },
    "Humanas_Biológicas_Exatas_Artísticas": { titulo: "Neuropsicólogo", descricao: "Estuda a mente humana com base biológica e estatística." },
    "Humanas_Biológicas_Artísticas_Exatas": { titulo: "Antropólogo Forense", descricao: "Investiga a história humana através de vestígios biológicos." },
    "Humanas_Artísticas_Exatas_Biológicas": { titulo: "Publicitário de Dados", descricao: "Cria campanhas criativas baseadas em métricas exatas." },
    "Humanas_Artísticas_Biológicas_Exatas": { titulo: "Jornalista Investigativo", descricao: "Investiga e narra fatos complexos da sociedade." },

    "Biológicas_Exatas_Humanas_Artísticas": { titulo: "Pesquisador Genético", descricao: "Trabalha em laboratório desvendando códigos da vida." },
    "Biológicas_Exatas_Artísticas_Humanas": { titulo: "Engenheiro Agrônomo", descricao: "Otimiza a produção da natureza com tecnologia." },
    "Biológicas_Humanas_Exatas_Artísticas": { titulo: "Médico Clínico", descricao: "Diagnostica pacientes unindo ciência e atendimento humano." },
    "Biológicas_Humanas_Artísticas_Exatas": { titulo: "Enfermeiro", descricao: "Cuidado direto com a vida e bem-estar das pessoas." },
    "Biológicas_Artísticas_Exatas_Humanas": { titulo: "Cirurgião Plástico", descricao: "Une conhecimento anatômico profundo com senso estético." },
    "Biológicas_Artísticas_Humanas_Exatas": { titulo: "Paisagista", descricao: "Cria ambientes vivos esteticamente agradáveis." },

    "Artísticas_Exatas_Biológicas_Humanas": { titulo: "Designer de Games", descricao: "Cria mundos virtuais com física realista e lógica." },
    "Artísticas_Exatas_Humanas_Biológicas": { titulo: "Arquiteto de Informação", descricao: "Organiza visualmente sistemas complexos para pessoas." },
    "Artísticas_Humanas_Exatas_Biológicas": { titulo: "Diretor de Cinema", descricao: "Conta histórias humanas gerenciando equipes e orçamentos." },
    "Artísticas_Humanas_Biológicas_Exatas": { titulo: "Ator / Performer", descricao: "Expressa a condição humana através do corpo e voz." },
    "Artísticas_Biológicas_Exatas_Humanas": { titulo: "Designer de Bionics", descricao: "Esculpe partes do corpo funcionais e estéticas." },
    "Artísticas_Biológicas_Humanas_Exatas": { titulo: "Ilustrador Científico", descricao: "Representa a natureza com precisão artística." }
};

async function apiRequest(acao, method = 'GET', body = null) {
    let url = `${API_URL}?acao=${acao}`;
    if (method === 'GET' && body) url += `&${new URLSearchParams(body).toString()}`;
    const opts = { method };
    if (method === 'POST' || method === 'PUT') {
        opts.body = JSON.stringify(body);
        opts.headers = { 'Content-Type': 'application/json' };
    }
    try {
        const r = await fetch(url, opts);
        return await r.json();
    } catch (e) { console.error(e); return null; }
}

function mostrarTela(id) {
    document.querySelectorAll('[id^="view-"]').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById(id);
    target.classList.remove('hidden');
    if (id !== 'view-admin') cancelarEdicao();
}
function mostrarDashboard() { mostrarTela('view-dashboard'); carregarHistorico(); }
function mostrarAdmin() { mostrarTela('view-admin'); carregarPerguntasAdmin(); }

function fazerLogin() {
    const nome = document.getElementById('loginNome').value.trim();
    if (!nome) return alert("Digite seu nome!");
    apiRequest('login', 'POST', { nome }).then(u => {
        if (u && !u.erro) {
            usuarioAtual = u;
            document.getElementById('tela-login').classList.add('hidden');
            document.getElementById('app-principal').classList.remove('hidden');
            document.getElementById('usuarioDisplay').innerText = u.nome;
            mostrarDashboard();
        } else alert("Erro no login.");
    });
}
function fazerLogout() { window.location.reload(); }

function embaralharArray(arr) { return arr.sort(() => Math.random() - 0.5); }

function iniciarTeste() {
    apiRequest('listarPerguntas').then(data => {
        if (!data || !data.length) return alert("Sem perguntas.");
        perguntas = embaralharArray(data);
        indicePergunta = 0;
        respostasQuiz = {};
        mostrarTela('view-quiz');
        renderizarPergunta();
    });
}

function renderizarPergunta() {
    const p = perguntas[indicePergunta];
    document.getElementById('pergunta-texto').innerText = p.texto;
    document.getElementById('contador-pergunta').innerText = `${indicePergunta + 1}/${perguntas.length}`;
    document.getElementById('progresso').style.width = `${((indicePergunta)/perguntas.length)*100}%`;
}

function responder(val) {
    const p = perguntas[indicePergunta];
    respostasQuiz[p.id] = val ? 1 : 0;
    respostasQuiz['cat_'+p.id] = p.categoria;
    
    if (indicePergunta < perguntas.length - 1) {
        indicePergunta++;
        renderizarPergunta();
    } else {
        document.getElementById('progresso').style.width = "100%";
        finalizarQuiz();
    }
}

function finalizarQuiz() {
    let scores = { 'Exatas': 0, 'Humanas': 0, 'Biológicas': 0, 'Artísticas': 0 };
    let total = 0, count = 0;

    for (let k in respostasQuiz) {
        if (k.startsWith('cat_')) continue;
        count++;
        if (respostasQuiz[k] === 1) {
            scores[respostasQuiz['cat_'+k]]++;
            total++;
        }
    }

    let ranking = Object.entries(scores).sort((a,b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    let chave = `${ranking[0][0]}_${ranking[1][0]}_${ranking[2][0]}_${ranking[3][0]}`;
    let titulo = "", descricao = "";

    if (total === 0) {
        titulo = "Explorador de Possibilidades";
        descricao = "Perfil aberto a novas áreas.";
    } else if (total >= count * 0.9) {
        titulo = "Polímata / Inovador";
        descricao = "Alta afinidade com todas as áreas.";
    } else {
        const perfil = MATRIZ_PROFISSOES[chave];
        if (perfil) {
            titulo = perfil.titulo;
            descricao = perfil.descricao;
        } else {
            titulo = ranking[0][0];
            descricao = "Forte tendência nesta área.";
        }
    }

    apiRequest('salvarResultado', 'POST', {
        usuario_id: usuarioAtual.id,
        titulo, descricao, pontuacao: scores
    }).then(() => {
        document.getElementById('res-titulo').innerText = titulo;
        document.getElementById('res-descricao').innerText = descricao;
        
        const container = document.getElementById('res-detalhes-visuais');
        container.innerHTML = '';
        ranking.forEach(([area, val]) => {
            let color = '#7c3aed';
            if (area === 'Humanas') color = '#db2777';
            if (area === 'Biológicas') color = '#059669';
            if (area === 'Artísticas') color = '#d97706';
            let pct = Math.min((val/6)*100, 100); 
            container.innerHTML += `
                <div class="stat-row">
                    <div class="stat-label"><strong>${area}</strong> <span>${val} pts</span></div>
                    <div class="stat-track"><div class="stat-fill" style="width:${pct}%; background:${color}"></div></div>
                </div>`;
        });
        mostrarTela('view-resultado');
    });
}

function carregarHistorico() {
    const el = document.getElementById('lista-historico');
    el.innerHTML = '<p style="color:#aaa;">Carregando...</p>';
    apiRequest('listarHistorico', 'GET', { usuario_id: usuarioAtual.id }).then(data => {
        el.innerHTML = '';
        if(!data || !data.length) return el.innerHTML = '<p style="text-align:center; padding:20px; color:#999">Nenhum teste ainda.</p>';
        data.forEach(h => {
            el.innerHTML += `
                <div class="history-item">
                    <div>
                        <h4 style="margin-bottom:4px;">${h.resultado_titulo}</h4>
                        <span class="badge">${h.data_formatada}</span>
                    </div>
                    <span class="tag">Concluído</span>
                </div>`;
        });
    });
}

function carregarPerguntasAdmin() {
    const el = document.getElementById('tabela-perguntas');
    el.innerHTML = '<tr><td colspan="4">Carregando...</td></tr>';
    apiRequest('listarPerguntas').then(data => {
        el.innerHTML = '';
        if(!data || !data.length) return el.innerHTML = '<tr><td colspan="4">Vazio</td></tr>';
        
        perguntas = data;

        data.forEach(p => {
            el.innerHTML += `
                <tr>
                    <td>#${p.id}</td>
                    <td>${p.texto}</td>
                    <td><span class="tag">${p.categoria}</span></td>
                    <td style="text-align:right;">
                        <button onclick="prepararEdicao(${p.id})">Editar</button>
                        <button onclick="excluir(${p.id})">Excluir</button>
                    </td>
                </tr>
            `;
        });
    });
}

function adicionarPergunta() {
    const texto = document.getElementById('adminTexto').value;
    const cat = document.getElementById('adminCategoria').value;
    if(!texto) return;
    apiRequest('adicionarPergunta', 'POST', { texto, categoria:cat }).then(() => {
        document.getElementById('adminTexto').value = '';
        carregarPerguntasAdmin();
    });
}

function prepararEdicao(id) {
    const p = perguntas.find(item => item.id == id);
    if (!p) return;

    idEdicaoAtual = id;
    document.getElementById('adminTexto').value = p.texto;
    document.getElementById('adminCategoria').value = p.categoria;

    document.getElementById('btn-add-group').classList.add('hidden');
    document.getElementById('btn-edit-group').classList.remove('hidden');
    document.getElementById('btn-edit-group').style.display = 'flex';
    document.getElementById('adminTexto').focus();
}

function cancelarEdicao() {
    idEdicaoAtual = null;
    document.getElementById('adminTexto').value = '';
    document.getElementById('adminCategoria').value = 'Exatas';
    
    document.getElementById('btn-add-group').classList.remove('hidden');
    document.getElementById('btn-edit-group').classList.add('hidden');
    document.getElementById('btn-edit-group').style.display = 'none';
}

function salvarEdicao() {
    if (!idEdicaoAtual) return;
    const texto = document.getElementById('adminTexto').value;
    const cat = document.getElementById('adminCategoria').value;
    if(!texto) return;

    apiRequest('editarPergunta', 'PUT', { id: idEdicaoAtual, texto, categoria: cat }).then(resp => {
        if (resp.sucesso) {
            cancelarEdicao();
            carregarPerguntasAdmin();
        } else {
            alert("Erro ao editar: " + resp.erro);
        }
    });
}

function excluir(id) {
    if(confirm('Excluir?')) {
        if(idEdicaoAtual == id) cancelarEdicao();
        apiRequest('excluirPergunta', 'POST', { id }).then(carregarPerguntasAdmin);
    }
}

function carregarDoJSON() {
    if(confirm('Importar dados.json?')) {
        fetch('dados.json').then(r=>r.json()).then(d => {
            apiRequest('popularBanco', 'POST', d).then(() => { alert('Feito!'); carregarPerguntasAdmin(); });
        });
    }
}