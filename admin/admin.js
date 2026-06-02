/* ========================================= */
/* PAINEL ADMINISTRATIVO - CRUD DE PRODUTOS  */
/* ========================================= */

/* ========================================= */
/* 1. VERIFICAÇÃO DE SESSÃO ADMIN            */
/* ========================================= */

// Função para verificar se o usuário está autenticado como admin
async function verificarSessaoAdmin() {
    try {
        // Fazer fetch GET para verificar se há sessão ativa de admin
        const resposta = await fetch('../backend/api/usuarios/verificar-sessao-admin.php', {
            method: 'GET'
        });

        // Converter para JSON
        const dados = await resposta.json();

        // Se não estiver logado como admin, redirecionar para login
        if (dados.logado === false) {
            window.location.href = 'login-admin.html';
        }
    } catch (erro) {
        console.error('Erro ao verificar sessão:', erro);
        window.location.href = 'login-admin.html';
    }
}

// Executar verificação ao carregar a página
verificarSessaoAdmin();

/* ========================================= */
/* 2. CARREGAR PRODUTOS NO PAINEL ADMIN      */
/* ========================================= */

// Capturar a div onde os produtos serão listados
const listaProdutosDiv = document.getElementById('lista-produtos');

// Função para carregar produtos da API
async function carregarProdutosAdmin() {
    try {
        // Exibir mensagem de carregamento
        listaProdutosDiv.innerHTML = '<p style="text-align: center; padding: 20px;">Carregando produtos...</p>';

        // Fazer fetch GET para buscar os produtos
        const resposta = await fetch('../backend/api/produtos/produtos.php', {
            method: 'GET'
        });

        // Converter para JSON
        const dados = await resposta.json();

        // Limpar a div
        listaProdutosDiv.innerHTML = '';

        // Verificar se há produtos
        if (!dados.produtos || dados.produtos.length === 0) {
            listaProdutosDiv.innerHTML = '<p style="text-align: center; padding: 20px;">Nenhum produto cadastrado.</p>';
            return;
        }

        // Iterar sobre os produtos e criar cards
        dados.produtos.forEach((produto) => {
            // Formatar o preço
            const precoFormatado = parseFloat(produto.preco).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            // Criar o card do produto
            const cardProduto = document.createElement('div');
            cardProduto.className = 'admin-produto-card';
            cardProduto.innerHTML = `
                <div class="admin-produto-info">
                    <h3>${produto.nome}</h3>
                    <p class="descricao">${produto.descricao}</p>
                    <p class="preco">${precoFormatado}</p>
                    <p class="estoque">Estoque: ${produto.estoque || 0}</p>
                </div>
                <div class="admin-produto-acoes">
                    <button class="btn-editar" data-id="${produto.id}" aria-label="Editar ${produto.nome}">Editar</button>
                    <button class="btn-excluir" data-id="${produto.id}" aria-label="Excluir ${produto.nome}">Excluir</button>
                </div>
            `;

            // Adicionar o card na div
            listaProdutosDiv.appendChild(cardProduto);
        });

        // Atribuir event listeners aos botões de editar e excluir
        atribuirEventListenersBotoes();

    } catch (erro) {
        console.error('Erro ao carregar produtos:', erro);
        listaProdutosDiv.innerHTML = '<p style="text-align: center; padding: 20px; color: red;">Erro ao carregar produtos.</p>';
    }
}

// Chamar a função ao carregar a página
carregarProdutosAdmin();

/* ========================================= */
/* 3. FORMULÁRIO DE SALVAR/EDITAR PRODUTO    */
/* ========================================= */

// Capturar elementos do formulário
const formProduto = document.getElementById('form-produto');
const inputProdutoId = document.getElementById('produto-id');
const inputProdutoNome = document.getElementById('produto-nome');
const inputProdutoDescricao = document.getElementById('produto-descricao');
const inputProdutoPreco = document.getElementById('produto-preco');
const inputProdutoEstoque = document.getElementById('produto-estoque');
const inputProdutoImagem = document.getElementById('produto-imagem');
const btnSalvarProduto = document.getElementById('btn-salvar-produto');
const btnCancelarEdicao = document.getElementById('btn-cancelar-edicao');
const secaoFormProduto = document.getElementById('secao-form-produto');
const titulSecaoForm = secaoFormProduto.querySelector('h2');
const tituloOriginal = titulSecaoForm.textContent;

// ESCUTAR O EVENTO SUBMIT DO FORMULÁRIO
formProduto.addEventListener('submit', async (e) => {
    // Prevenir comportamento padrão
    e.preventDefault();

    // Coletar os valores dos campos
    const produtoId = inputProdutoId.value.trim();
    const nome = inputProdutoNome.value.trim();
    const descricao = inputProdutoDescricao.value.trim();
    const preco = inputProdutoPreco.value;
    const estoque = inputProdutoEstoque.value || 0;
    const imagem = inputProdutoImagem.value.trim();

    // Validar campos obrigatórios
    if (!nome || !preco) {
        alert('Por favor, preencha os campos obrigatórios (nome e preço).');
        return;
    }

    // Desabilitar o botão durante o envio
    btnSalvarProduto.disabled = true;
    btnSalvarProduto.textContent = 'Salvando...';

    try {
        let resposta;
        let dados;

        // SE É NOVO PRODUTO (POST)
        if (!produtoId) {
            // Criar FormData
            const formData = new FormData();
            formData.append('nome', nome);
            formData.append('descricao', descricao);
            formData.append('preco', preco);
            formData.append('estoque', estoque);
            formData.append('imagem', imagem);

            // Enviar via POST
            resposta = await fetch('../backend/api/produtos/produtos.php', {
                method: 'POST',
                body: formData
            });

            dados = await resposta.json();

        } else {
            // SE É EDIÇÃO (PUT)
            // Criar URLSearchParams
            const params = new URLSearchParams();
            params.append('id', produtoId);
            params.append('nome', nome);
            params.append('descricao', descricao);
            params.append('preco', preco);
            params.append('estoque', estoque);
            params.append('imagem', imagem);

            // Enviar via PUT
            resposta = await fetch('../backend/api/produtos/produtos.php', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            });

            dados = await resposta.json();
        }

        // Verificar se foi sucesso
        if (dados.sucesso === true) {
            alert(dados.mensagem || 'Produto salvo com sucesso!');

            // Limpar o formulário
            formProduto.reset();
            inputProdutoId.value = '';

            // Ocultar botão cancelar
            btnCancelarEdicao.style.display = 'none';

            // Restaurar título
            titulSecaoForm.textContent = tituloOriginal;

            // Recarregar a lista de produtos
            carregarProdutosAdmin();
        } else {
            alert(dados.mensagem || 'Erro ao salvar produto.');
        }
    } catch (erro) {
        console.error('Erro ao salvar produto:', erro);
        alert('Erro ao conectar ao servidor. Tente novamente mais tarde.');
    } finally {
        // Reabilitar o botão
        btnSalvarProduto.disabled = false;
        btnSalvarProduto.textContent = 'Salvar Produto';
    }
});

/* ========================================= */
/* 4. BOTÃO EDITAR                           */
/* ========================================= */

function atribuirEventListenersBotoes() {
    // Selecionar todos os botões editar
    const botoesEditar = document.querySelectorAll('.btn-editar');
    const botoesExcluir = document.querySelectorAll('.btn-excluir');

    // Adicionar listener em cada botão editar
    botoesEditar.forEach((botao) => {
        botao.addEventListener('click', async (e) => {
            const produtoId = e.target.getAttribute('data-id');

            // Buscar os dados do produto para editar
            try {
                const resposta = await fetch(`../backend/api/produtos/produtos.php?id=${produtoId}`, {
                    method: 'GET'
                });

                const dados = await resposta.json();

                if (dados.sucesso === true && dados.produto) {
                    const produto = dados.produto;

                    // Preencher o formulário com os dados do produto
                    inputProdutoId.value = produto.id;
                    inputProdutoNome.value = produto.nome;
                    inputProdutoDescricao.value = produto.descricao || '';
                    inputProdutoPreco.value = produto.preco;
                    inputProdutoEstoque.value = produto.estoque || 0;
                    inputProdutoImagem.value = produto.imagem || '';

                    // Mostrar o botão cancelar
                    btnCancelarEdicao.style.display = 'inline-block';

                    // Mudar o título para "Editar Produto"
                    titulSecaoForm.textContent = 'Editar Produto';

                    // Scroll até o formulário
                    secaoFormProduto.scrollIntoView({ behavior: 'smooth' });
                } else {
                    alert('Erro ao carregar dados do produto.');
                }
            } catch (erro) {
                console.error('Erro ao carregar produto para editar:', erro);
                alert('Erro ao carregar produto.');
            }
        });
    });

    // Adicionar listener em cada botão excluir
    botoesExcluir.forEach((botao) => {
        botao.addEventListener('click', async (e) => {
            const produtoId = e.target.getAttribute('data-id');

            // Pedir confirmação
            const confirmar = confirm('Deseja excluir este produto?');

            if (confirmar) {
                try {
                    // Fazer fetch DELETE
                    const resposta = await fetch(`../backend/api/produtos/produtos.php?id=${produtoId}`, {
                        method: 'DELETE'
                    });

                    const dados = await resposta.json();

                    if (dados.sucesso === true) {
                        alert(dados.mensagem || 'Produto excluído com sucesso!');

                        // Recarregar a lista de produtos
                        carregarProdutosAdmin();
                    } else {
                        alert(dados.mensagem || 'Erro ao excluir produto.');
                    }
                } catch (erro) {
                    console.error('Erro ao excluir produto:', erro);
                    alert('Erro ao conectar ao servidor. Tente novamente mais tarde.');
                }
            }
        });
    });
}

/* ========================================= */
/* 5. BOTÃO CANCELAR                         */
/* ========================================= */

btnCancelarEdicao.addEventListener('click', () => {
    // Limpar o formulário
    formProduto.reset();
    inputProdutoId.value = '';

    // Ocultar o botão cancelar
    btnCancelarEdicao.style.display = 'none';

    // Restaurar o título
    titulSecaoForm.textContent = tituloOriginal;
});

/* ========================================= */
/* 6. BOTÃO SAIR                             */
/* ========================================= */

const btnSairAdmin = document.getElementById('btn-sair-admin');

btnSairAdmin.addEventListener('click', async () => {
    try {
        // Fazer fetch GET para logout
        await fetch('../backend/api/usuarios/logout-admin.php', {
            method: 'GET'
        });

        // Redirecionar para login admin
        window.location.href = 'login-admin.html';
    } catch (erro) {
        console.error('Erro ao fazer logout:', erro);
        // Mesmo com erro, redireciona
        window.location.href = 'login-admin.html';
    }
});
