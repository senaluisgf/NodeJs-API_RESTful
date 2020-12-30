const modelo = require('./modeloTabelaProdutos')
const NaoEncontrado = require('../../../erros/NaoEncontrado')
const instancia = require('../../../banco-de-dados/index')

module.exports = {
    listar(fornecedor_id, criterios = {}) {
        criterios.fornecedor = fornecedor_id
        return modelo.findAll({
            where: criterios,
            raw: true
        })
    },
    inserir(produto) {
        return modelo.create(produto)
    },
    async pegaPorId(produto_id, fornecedor_id) {
        const encontrado = await modelo.findOne({
            where: {
                id: produto_id,
                fornecedor: fornecedor_id
            }
        })

        if (!encontrado) {
            throw new NaoEncontrado("Produto")
        } else {
            return encontrado
        }
    },
    remover(produto_id, fornecedor_id) {
        return modelo.destroy({
            where: {
                id: produto_id,
                fornecedor: fornecedor_id
            }
        })

    },
    atualizar(acharProduto, dados) {
        return modelo.update(dados, {
            where: acharProduto,
            raw: true
        })
    },
    subtrair(acharProduto, campo, valor) {
        return instancia.transaction(async transacao => {
            const produto = await modelo.findOne({ where: acharProduto })

            produto[campo] = valor

            await produto.save()

            return produto
        })
    }
}