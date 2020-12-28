const modelos = [
    require('../rotas/fornecedores/modeloTabelaFornecedores'),
    require('../rotas/fornecedores/produtos/modeloTabelaProdutos')
]

async function criarTabelas() {
    for (let contador = 0; contador < modelos.length; contador++) {
        const modelo = modelos[contador]
        await modelo.sync()
    }
}

criarTabelas()