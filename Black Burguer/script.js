document.addEventListener('DOMContentLoaded', () => {


    /* ==========================================
       1. CRIPTOGRAFIA DA SENHA - SHA-256
       ========================================== */

    async function gerarSHA256(texto) {

        const encoder = new TextEncoder();

        const data = encoder.encode(texto);

        const hashBuffer =
            await crypto.subtle.digest(
                'SHA-256',
                data
            );

        const hashArray =
            Array.from(
                new Uint8Array(hashBuffer)
            );

        return hashArray
            .map(
                b => b.toString(16).padStart(2, '0')
            )
            .join('');

    }


    /* ==========================================
       2. FORMATAÇÃO DO CPF
       ========================================== */

    const campoCPF =
        document.getElementById('cad-cpf');


    if (campoCPF) {

        campoCPF.addEventListener(
            'input',
            function () {

                let cpf =
                    this.value.replace(/\D/g, '');

                cpf =
                    cpf.substring(0, 11);


                if (cpf.length > 9) {

                    cpf =
                        cpf.substring(0, 3) + '.' +
                        cpf.substring(3, 6) + '.' +
                        cpf.substring(6, 9) + '-' +
                        cpf.substring(9, 11);

                }

                else if (cpf.length > 6) {

                    cpf =
                        cpf.substring(0, 3) + '.' +
                        cpf.substring(3, 6) + '.' +
                        cpf.substring(6, 9);

                }

                else if (cpf.length > 3) {

                    cpf =
                        cpf.substring(0, 3) + '.' +
                        cpf.substring(3, 6);

                }


                this.value = cpf;

            }
        );

    }


    /* ==========================================
       3. MENU SOBRE E CONTATO
       ========================================== */

    const btnSobre =
        document.getElementById('btn-sobre');


    const menuVerticalSobre =
        document.getElementById(
            'menu-vertical-sobre'
        );


    const btnContato =
        document.getElementById('btn-contato');


    const menuVerticalContato =
        document.getElementById(
            'menu-vertical-contato'
        );


    if (btnSobre && menuVerticalSobre) {

        btnSobre.addEventListener(
            'click',
            function(event) {

                abreMenu(
                    event,
                    menuVerticalSobre
                );

            }
        );

    }


    if (btnContato && menuVerticalContato) {

        btnContato.addEventListener(
            'click',
            function(event) {

                abreMenu(
                    event,
                    menuVerticalContato
                );

            }
        );

    }


    function abreMenu(event, menu) {

        event.preventDefault();

        menu.classList.toggle('active');

    }


    function fechaMenu(event, menu, btn) {

        if (
            menu &&
            btn &&
            !menu.contains(event.target) &&
            event.target !== btn
        ) {

            menu.classList.remove('active');

        }

    }


    document.addEventListener(
        'click',
        function(event) {

            fechaMenu(
                event,
                menuVerticalSobre,
                btnSobre
            );


            fechaMenu(
                event,
                menuVerticalContato,
                btnContato
            );

        }
    );


    /* ==========================================
       4. CAIXINHA DE INFORMAÇÃO
       ========================================== */

    const itensInfo =
        document.querySelectorAll(
            '.info-menu'
        );


    const caixaInfo =
        document.getElementById(
            'caixa-info'
        );


    if (caixaInfo) {

        itensInfo.forEach(item => {

            item.addEventListener(
                'mouseenter',
                function() {

                    const mensagem =
                        item.getAttribute(
                            'data-mensagem'
                        );


                    if (mensagem) {

                        caixaInfo.textContent =
                            mensagem;

                        caixaInfo.style.display =
                            'block';


                        const posicao =
                            item.getBoundingClientRect();


                        caixaInfo.style.left =
                            (
                                posicao.right + 15
                            ) + 'px';


                        caixaInfo.style.top =
                            posicao.top + 'px';

                    }

                }
            );


            item.addEventListener(
                'mouseleave',
                function() {

                    caixaInfo.style.display =
                        'none';

                }
            );

        });

    }


 /* ==========================================
   5. CADASTRO
   ========================================== */
const formCadastro = document.getElementById('form-cadastro');

if (formCadastro) {
    formCadastro.addEventListener('submit', async function(e) {
        e.preventDefault();

        const nome = document.getElementById('cad-nome').value;
        const email = document.getElementById('cad-email').value.toLowerCase().trim();
        const cpf = document.getElementById('cad-cpf').value;
        const endereco = document.getElementById('cad-endereco').value;
        const senha = document.getElementById('cad-senha').value;

        const senhaCriptografada = await gerarSHA256(senha);

        // Busca lista de usuários cadastrados (ou cria uma nova lista vazia)
        const usuariosCadastrados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];

        // Verifica se o e-mail já existe
        const emailExistente = usuariosCadastrados.some(u => u.email === email);
        if (emailExistente) {
            alert('Este e-mail já está cadastrado!');
            return;
        }

        const novoUsuario = {
            nome: nome,
            email: email,
            cpf: cpf,
            endereco: endereco,
            senha: senhaCriptografada
        };

        // Adiciona à lista e salva
        usuariosCadastrados.push(novoUsuario);
        localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosCadastrados));

        // Mantido para compatibilidade se você usa 'usuarioRegistrado' individual em outro ponto:
        localStorage.setItem('usuarioRegistrado', JSON.stringify(novoUsuario));

        // Geração do arquivo TXT
        const dadosTXT = 
`========================================
         BLACK BURGUER
      CADASTRO DE CLIENTE
========================================

Nome: ${nome}
CPF: ${cpf}
Endereço: ${endereco}
E-mail: ${email}
Senha criptografada:
${senhaCriptografada}

========================================`;

        const arquivo = new Blob([dadosTXT], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(arquivo);
        link.download = 'cadastro.txt';
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        alert('Cadastro efetuado com sucesso!\n\nO arquivo cadastro.txt foi baixado.');
        window.location.href = 'login.html';
    });
}


/* ==========================================
   6. LOGIN
   ========================================== */
const formLogin = document.getElementById('form-login');

if (formLogin) {
    formLogin.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('login-email').value.toLowerCase().trim();
        const senha = document.getElementById('login-senha').value;

        // Busca a lista de usuários cadastrados
        const usuariosCadastrados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];

        // Se ainda estiver usando a chave antiga individual:
        const usuarioUnico = JSON.parse(localStorage.getItem('usuarioRegistrado'));
        if (usuarioUnico && !usuariosCadastrados.some(u => u.email === usuarioUnico.email)) {
            usuariosCadastrados.push(usuarioUnico);
        }

        if (usuariosCadastrados.length === 0) {
            alert('Nenhum usuário cadastrado até o momento.');
            return;
        }

        const senhaDigitadaHash = await gerarSHA256(senha);

        // Busca o usuário que corresponda ao e-mail e hash da senha
        const usuarioValido = usuariosCadastrados.find(
            u => u.email === email && u.senha === senhaDigitadaHash
        );

        if (usuarioValido) {
            // SALVA A SESSÃO E O E-MAIL DO USUÁRIO LOGADO
            localStorage.setItem('usuarioLogado', 'true');
            localStorage.setItem('userEmail', usuarioValido.email);

            window.location.href = 'sistema.html';
        } else {
            alert('E-mail ou senha inválidos! Cadastre-se ou verifique seus dados.');
        }
    });
}

    /* ==========================================
       7. CARRINHO
       ========================================== */

    const cartList =
        document.getElementById(
            'cart-list'
        );


    const cartTotal =
        document.getElementById(
            'cart-total'
        );


    const formPedido =
        document.getElementById(
            'form-pedido'
        );


    let carrinho = [];


    const menuGrid =
        document.getElementById(
            'menu-grid'
        );


    function qtdNoCarrinho(id) {

        return carrinho.filter(
            item => item.id === id
        ).length;

    }


    /* Monta o cardápio a partir do ESTOQUE (dados.js) */

    function renderCardapio() {

        if (!menuGrid || typeof BB === 'undefined') return;


        menuGrid.innerHTML =
            BB.produtos().map(p => {

                const esgotado = p.qtd <= 0;

                const limite =
                    !esgotado &&
                    qtdNoCarrinho(p.id) >= p.qtd;

                const classeTag =
                    esgotado ? 'zerado' :
                    p.qtd <= p.minimo ? 'baixo' : '';

                const textoTag =
                    esgotado ? 'Esgotado' :
                    p.qtd + ' em estoque';

                const textoBotao =
                    esgotado ? 'Indisponível' :
                    limite ? 'Limite do estoque atingido' :
                    'Adicionar ao Carrinho';

                return `
                    <div class="menu-item${esgotado ? ' esgotado' : ''}">
                        <h3>${BB.esc(p.nome)}</h3>
                        <p>${BB.esc(p.descricao)}</p>
                        <span>${BB.moeda(p.preco)}</span>
                        <small class="estoque-tag ${classeTag}">${textoTag}</small>
                        <button
                            class="btn-padrao btn-add"
                            data-id="${p.id}"
                            ${esgotado || limite ? 'disabled' : ''}>
                            ${textoBotao}
                        </button>
                    </div>`;

            }).join('') ||
            '<p>Nenhum produto disponível. Cadastre produtos na página Estoque.</p>';

    }


    if (menuGrid) {

        menuGrid.addEventListener(
            'click',
            function(event) {

                const btn =
                    event.target.closest('.btn-add');

                if (!btn || btn.disabled) return;


                const produto =
                    BB.produtos().find(
                        p => p.id === btn.dataset.id
                    );


                if (
                    !produto ||
                    qtdNoCarrinho(produto.id) >= produto.qtd
                ) {

                    renderCardapio();

                    return;

                }


                carrinho.push({

                    id: produto.id,

                    nome: produto.nome,

                    preco: produto.preco

                });


                atualizarCarrinho();

            }
        );


        /* estoque alterado em outra aba */

        window.addEventListener(
            'storage',
            renderCardapio
        );

        renderCardapio();

    }


    function atualizarCarrinho() {

        renderCardapio();

        if (!cartList) return;


        cartList.innerHTML = '';


        let total = 0;


        carrinho.forEach(item => {

            total += item.preco;


            const li =
                document.createElement(
                    'li'
                );


            li.innerHTML = `

                <span>
                    ${BB.esc(item.nome)}
                </span>

                <span>
                    R$
                    ${item.preco
                        .toFixed(2)
                        .replace('.', ',')}
                </span>

            `;


            cartList.appendChild(li);

        });


        if (cartTotal) {

            cartTotal.textContent =
                total
                    .toFixed(2)
                    .replace('.', ',');

        }

    }


    /* ==========================================
       8. ELEMENTOS DO MODAL
       ========================================== */

    const modalPedido =
        document.getElementById(
            'modal-pedido'
        );


    const fecharModal =
        document.getElementById(
            'fechar-modal'
        );


    const resumoItens =
        document.getElementById(
            'resumo-itens'
        );


    const resumoTotal =
        document.getElementById(
            'resumo-total'
        );


    const resumoEndereco =
        document.getElementById(
            'resumo-endereco'
        );


    const formaPagamento =
        document.getElementById(
            'forma-pagamento'
        );


    const areaPix =
        document.getElementById(
            'area-pix'
        );


    const areaCartao =
        document.getElementById(
            'area-cartao'
        );


    const areaDinheiro =
        document.getElementById(
            'area-dinheiro'
        );


    const qrcode =
        document.getElementById(
            'qrcode'
        );


    const valorDinheiro =
        document.getElementById(
            'valor-dinheiro'
        );


    const valorTroco =
        document.getElementById(
            'valor-troco'
        );


    const confirmarPedido =
        document.getElementById(
            'confirmar-pedido'
        );


    /* ==========================================
       9. CALCULAR TOTAL
       ========================================== */

    function calcularTotal() {

        return carrinho.reduce(
            (total, item) => {

                return total + item.preco;

            },
            0
        );

    }


    /* ==========================================
       10. ABRIR MODAL
       ========================================== */

    function abrirModalPedido() {

        if (!modalPedido) return;


        const endereco =
            document.getElementById(
                'endereco-entrega'
            ).value.trim();


        if (!endereco) {

            alert(
                'Digite o endereço de entrega.'
            );

            return;

        }


        if (carrinho.length === 0) {

            alert(
                'Seu carrinho está vazio! ' +
                'Selecione ao menos um hambúrguer.'
            );

            return;

        }


        /* LIMPA O RESUMO */

        resumoItens.innerHTML = '';


        /* COLOCA OS PRODUTOS */

        carrinho.forEach(item => {

            const div =
                document.createElement(
                    'div'
                );


            div.className =
                'resumo-item';


            div.innerHTML = `

                <span>
                    ${BB.esc(item.nome)}
                </span>

                <strong>
                    R$ ${item.preco
                        .toFixed(2)
                        .replace('.', ',')}
                </strong>

            `;


            resumoItens.appendChild(div);

        });


        /* TOTAL */

        const total =
            calcularTotal();


        resumoTotal.textContent =
            total
                .toFixed(2)
                .replace('.', ',');


        /* ENDEREÇO */

        resumoEndereco.textContent =
            endereco;


        /* RESETA PAGAMENTO */

        if (formaPagamento) {

            formaPagamento.value = '';

        }


        esconderAreasPagamento();


        if (qrcode) {

            qrcode.innerHTML = '';

        }


        if (valorDinheiro) {

            valorDinheiro.value = '';

        }


        if (valorTroco) {

            valorTroco.textContent =
                '0,00';

        }


        /* ABRE */

        modalPedido.classList.add(
            'ativo'
        );


        document.body.style.overflow =
            'hidden';

    }


    /* ==========================================
       11. ESCONDER ÁREAS DE PAGAMENTO
       ========================================== */

    function esconderAreasPagamento() {

        if (areaPix) {

            areaPix.classList.remove(
                'ativo'
            );

        }


        if (areaCartao) {

            areaCartao.classList.remove(
                'ativo'
            );

        }


        if (areaDinheiro) {

            areaDinheiro.classList.remove(
                'ativo'
            );

        }

    }


    /* ==========================================
       12. FORMA DE PAGAMENTO
       ========================================== */

    if (formaPagamento) {

        formaPagamento.addEventListener(
            'change',
            function() {

                esconderAreasPagamento();


                const pagamento =
                    this.value;


                if (pagamento === 'pix') {

                    mostrarPix();

                }


                if (
                    pagamento === 'debito' ||
                    pagamento === 'credito'
                ) {

                    if (areaCartao) {

                        areaCartao.classList.add(
                            'ativo'
                        );

                    }

                }


                if (pagamento === 'dinheiro') {

                    if (areaDinheiro) {

                        areaDinheiro.classList.add(
                            'ativo'
                        );

                    }

                }

            }
        );

    }


    /* ==========================================
       13. QR CODE PIX
       ========================================== */

    function mostrarPix() {

        if (!areaPix) return;


        areaPix.classList.add(
            'ativo'
        );


        if (!qrcode) return;


        qrcode.innerHTML = '';


        const total =
            calcularTotal();


        const textoPIX =
            `BLACK BURGUER - PEDIDO - R$ ${total.toFixed(2)}`;


        if (typeof QRCode !== 'undefined') {

            new QRCode(
                qrcode,
                {
                    text: textoPIX,
                    width: 200,
                    height: 200
                }
            );

        }

    }


    /* ==========================================
       14. CALCULAR TROCO
       ========================================== */

    if (valorDinheiro) {

        valorDinheiro.addEventListener(
            'input',
            function() {

                const valorPago =
                    parseFloat(
                        this.value
                    ) || 0;


                const total =
                    calcularTotal();


                const troco =
                    valorPago - total;


                if (troco >= 0) {

                    valorTroco.textContent =
                        troco
                            .toFixed(2)
                            .replace('.', ',');

                }

                else {

                    valorTroco.textContent =
                        '0,00';

                }

            }
        );

    }


    /* ==========================================
       15. FINALIZAR PEDIDO
       ========================================== */

    if (formPedido) {

        formPedido.addEventListener(
            'submit',
            function(e) {

                e.preventDefault();


                abrirModalPedido();

            }
        );

    }


    /* ==========================================
       16. FECHAR MODAL
       ========================================== */

    if (fecharModal) {

        fecharModal.addEventListener(
            'click',
            function() {

                fecharModalPedido();

            }
        );

    }


    function fecharModalPedido() {

        if (!modalPedido) return;


        modalPedido.classList.remove(
            'ativo'
        );


        document.body.style.overflow =
            '';

    }


    /* ==========================================
       17. FECHAR CLICANDO FORA
       ========================================== */

    if (modalPedido) {

        modalPedido.addEventListener(
            'click',
            function(event) {

                if (
                    event.target ===
                    modalPedido
                ) {

                    fecharModalPedido();

                }

            }
        );

    }


    /* ==========================================
       18. CONFIRMAR PAGAMENTO
       ========================================== */

    if (confirmarPedido) {

        confirmarPedido.addEventListener(
            'click',
            function() {

                if (carrinho.length === 0) {

                    alert(
                        'Seu carrinho está vazio.'
                    );

                    return;

                }


                const pagamento =
                    formaPagamento.value;


                if (!pagamento) {

                    alert(
                        'Selecione uma forma de pagamento.'
                    );

                    return;

                }


                /* ==============================
                   DINHEIRO
                   ============================== */

                if (
                    pagamento ===
                    'dinheiro'
                ) {

                    const valorPago =
                        parseFloat(
                            valorDinheiro.value
                        ) || 0;


                    const total =
                        calcularTotal();


                    if (valorPago < total) {

                        alert(
                            'O valor informado é menor que o total do pedido.'
                        );

                        return;

                    }

                }


                /* ==============================
                   CARTÃO
                   ============================== */

                if (
                    pagamento === 'debito' ||
                    pagamento === 'credito'
                ) {

                    const numero =
                        document.getElementById(
                            'numero-cartao'
                        ).value.trim();


                    const validade =
                        document.getElementById(
                            'validade-cartao'
                        ).value.trim();


                    const cvv =
                        document.getElementById(
                            'cvv-cartao'
                        ).value.trim();


                    const nome =
                        document.getElementById(
                            'nome-cartao'
                        ).value.trim();


                    if (
                        !numero ||
                        !validade ||
                        !cvv ||
                        !nome
                    ) {

                        alert(
                            'Preencha todos os dados do cartão.'
                        );

                        return;

                    }

                }


                /* ==============================
                   FORMA DE PAGAMENTO
                   ============================== */

                let nomePagamento =
                    '';


                if (
                    pagamento === 'pix'
                ) {

                    nomePagamento =
                        'PIX';

                }

                else if (
                    pagamento === 'debito'
                ) {

                    nomePagamento =
                        'Cartão de Débito';

                }

                else if (
                    pagamento === 'credito'
                ) {

                    nomePagamento =
                        'Cartão de Crédito';

                }

                else if (
                    pagamento === 'dinheiro'
                ) {

                    nomePagamento =
                        'Dinheiro';

                }


                const total =
                    calcularTotal();


                const endereco =
                    document.getElementById(
                        'endereco-entrega'
                    ).value;


                /* ==============================
                   CONFIRMAÇÃO
                   ============================== */

                /* ==============================
                   REGISTRAR PEDIDO + BAIXA NO ESTOQUE
                   ============================== */

                const agrupado = {};

            carrinho.forEach(item => {
                if (!agrupado[item.id]) {
                 agrupado[item.id] = {
                      id: item.id,
                     nome: item.nome,
                     preco: item.preco,
                        imagem: item.imagem || 'https://via.placeholder.com/150', // <--- Adicionado
                      qtd: 0
        };
    }
    agrupado[item.id].qtd++;
});


                const cliente =
                    (
                        JSON.parse(
                            localStorage.getItem(
                                'usuarioRegistrado'
                            ) || 'null'
                        ) || {}
                    ).nome || 'Cliente';


                const resultado =
                    BB.registrarPedido({

                        itens: Object.values(agrupado),

                        endereco: endereco,

                        pagamento: nomePagamento,

                        total: total,

                        cliente: cliente

                    });


                if (!resultado.ok) {

                    alert(resultado.erro);

                    renderCardapio();

                    return;

                }


                alert(

                    '🍔 BLACK BURGUER 🍔\n\n' +

                    'Pedido nº ' + resultado.pedido.numero +
                    ' realizado com sucesso!\n\n' +

                    'Total: R$ ' +
                    total
                        .toFixed(2)
                        .replace('.', ',') +

                    '\nPagamento: ' +
                    nomePagamento +

                    '\nEndereço: ' +
                    endereco +

                    '\n\nObrigado pela preferência!'

                );

                const formProduto = document.getElementById('form-produto');

if (formProduto) {
    formProduto.addEventListener('submit', function(e) {
        e.preventDefault();

        const id = document.getElementById('prod-id').value;
        const nome = document.getElementById('prod-nome').value;
        const preco = parseFloat(document.getElementById('prod-preco').value);
        const qtd = parseInt(document.getElementById('prod-qtd').value);
        const min = parseInt(document.getElementById('prod-min').value);
        const imagem = document.getElementById('prod-imagem').value; // <--- Captura a URL
        const desc = document.getElementById('prod-desc').value;

        const produto = {
            id: id || Date.now().toString(),
            nome: nome,
            preco: preco,
            qtd: qtd,
            min: min,
            imagem: imagem, // <--- Salva no objeto
            desc: desc
        };

        // Salve ou atualize o produto no seu array de estoque/localStorage (BB.salvarProduto ou equivalente)
        if (typeof BB !== 'undefined' && BB.salvarProduto) {
            BB.salvarProduto(produto);
        }

        formProduto.reset();
        // Atualize a renderização da tabela de estoque e do cardápio
    });
}


// Exemplo de trecho ao montar a <tr> da tabela:
const tr = document.createElement('tr');
tr.innerHTML = `
    <td>
        <img src="${produto.imagem}" alt="${produto.nome}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;">
    </td>
    <td>${produto.nome}</td>
    <td>R$ ${produto.preco.toFixed(2)}</td>
    <td>${produto.qtd}</td>
    ...
`;


// Exemplo de card do lanche no cardápio:
const card = `
    <div class="card-lanche">
        <img src="${produto.imagem}" alt="${produto.nome}" class="img-lanche">
        <h3>${produto.nome}</h3>
        <p>${produto.desc}</p>
        <span>R$ ${produto.preco.toFixed(2)}</span>
        <button onclick="adicionarAoCarrinho('${produto.id}')">Adicionar</button>
    </div>
`;

                /* LIMPA CARRINHO */

                carrinho = [];


                atualizarCarrinho();


                /* FECHA MODAL */

                fecharModalPedido();


                /* LIMPA FORMULÁRIO */

                formPedido.reset();


                /* LIMPA PAGAMENTO */

                esconderAreasPagamento();


                if (qrcode) {

                    qrcode.innerHTML = '';

                }

            }
        );

    }


});


/* ==========================================
   19. Validação de usuario admin
   ========================================== */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Lista de e-mails com permissão de acesso
    const emailsPermitidos = [
        "admin@blackburguer.com",
        "gerente@blackburguer.com",
        "seuemail@gmail.com"
    ];

    // 2. Recupera o e-mail do usuário logado (armazenado no localStorage)
    const emailUsuarioLogado = localStorage.getItem("userEmail");

    // 3. Se o e-mail estiver na lista, exibe os botões
    if (emailUsuarioLogado && emailsPermitidos.includes(emailUsuarioLogado.toLowerCase())) {
        document.querySelectorAll(".admin-only").forEach(item => {
            item.style.display = "block"; // Ou "inline-block" / "list-item" conforme o CSS do seu menu
        });
    }
});