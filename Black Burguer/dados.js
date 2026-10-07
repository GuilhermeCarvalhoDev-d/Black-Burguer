/* ==========================================
   BLACK BURGUER - DADOS COMPARTILHADOS
   Usado por: sistema.html, estoque.html, pedidos.html
   ========================================== */

const BB = (() => {

    const CHAVE_ESTOQUE = 'bb_estoque';
    const CHAVE_PEDIDOS = 'bb_pedidos';

    /* Produtos iniciais (os mesmos que existiam fixos no sistema.html) */
    const PRODUTOS_INICIAIS = [
        { id: 'p1', nome: 'Classic Cheeseburger', preco: 28.90, qtd: 20, minimo: 5,
          descricao: 'Pão brioche, burger 160g, queijo cheddar duplo e maionese da casa.' },
        { id: 'p2', nome: 'Bacon Monster', preco: 34.90, qtd: 20, minimo: 5,
          descricao: 'Pão australiano, burger 180g, bacon crocante, cheddar e molho BBQ.' },
        { id: 'p3', nome: 'Smash Duplo', preco: 31.50, qtd: 20, minimo: 5,
          descricao: '2x hambúrguer prensado de 90g, queijo prato, picles e molho especial.' },
        { id: 'p4', nome: 'Batata Rústica', preco: 16.00, qtd: 30, minimo: 8,
          descricao: 'Porção de batatas rústicas temperadas com alecrim e páprica.' }
    ];

    function ler(chave, padrao) {
        try {
            const v = JSON.parse(localStorage.getItem(chave));
            return v === null || v === undefined ? padrao : v;
        } catch (e) {
            return padrao;
        }
    }

    function gravar(chave, valor) {
        localStorage.setItem(chave, JSON.stringify(valor));
    }

    /* ---------- PRODUTOS / ESTOQUE ---------- */

    function produtos() {
        let lista = ler(CHAVE_ESTOQUE, null);
        if (!lista) {
            lista = PRODUTOS_INICIAIS;
            gravar(CHAVE_ESTOQUE, lista);
        }
        return lista;
    }

    function salvarProdutos(lista) {
        gravar(CHAVE_ESTOQUE, lista);
    }

    /* ---------- PEDIDOS ---------- */

    function pedidos() {
        return ler(CHAVE_PEDIDOS, []);
    }

    function salvarPedidos(lista) {
        gravar(CHAVE_PEDIDOS, lista);
    }

    /* Chamado pelo "Confirmar Pedido" do sistema.html.
       itens: [{ id, nome, preco, qtd }]
       Confere o estoque, dá baixa e grava o pedido. */
    function registrarPedido(dados) {

        const estoque = produtos();

        for (const item of dados.itens) {

            const produto = estoque.find(p => p.id === item.id);

            if (!produto) {
                return { ok: false, erro: '"' + item.nome + '" não está mais disponível no cardápio.' };
            }

            if (produto.qtd < item.qtd) {
                return { ok: false, erro: 'Estoque insuficiente de "' + item.nome + '". Restam ' + produto.qtd + ' unidade(s).' };
            }

        }

        dados.itens.forEach(item => {
            estoque.find(p => p.id === item.id).qtd -= item.qtd;
        });

        salvarProdutos(estoque);

        const lista = pedidos();

        const pedido = {
            numero: lista.reduce((maior, p) => Math.max(maior, p.numero), 0) + 1,
            data: new Date().toISOString(),
            cliente: dados.cliente,
            endereco: dados.endereco,
            pagamento: dados.pagamento,
            itens: dados.itens,
            total: Math.round(dados.total * 100) / 100,
            status: 'pendente'
        };

        lista.push(pedido);
        salvarPedidos(lista);

        return { ok: true, pedido: pedido };
    }

    /* Altera o status. Cancelar devolve os itens ao estoque. */
    function mudarStatus(numero, status) {

        const lista = pedidos();
        const pedido = lista.find(p => p.numero === numero);

        if (!pedido || pedido.status === 'cancelado') return;

        if (status === 'cancelado') {

            const estoque = produtos();

            pedido.itens.forEach(item => {
                const produto = estoque.find(p => p.id === item.id);
                if (produto) produto.qtd += item.qtd;
            });

            salvarProdutos(estoque);

        }

        pedido.status = status;
        salvarPedidos(lista);
    }

    /* ---------- AUXILIARES ---------- */

    function moeda(valor) {
        return 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
    }

    function esc(texto) {
        return String(texto).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    return { produtos, salvarProdutos, pedidos, registrarPedido, mudarStatus, moeda, esc };

})();
