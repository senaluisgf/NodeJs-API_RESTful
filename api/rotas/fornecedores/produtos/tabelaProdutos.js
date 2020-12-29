const modelo = require('./modeloTabelaProdutos')
const NaoEncontrado = require('../../../erros/NaoEncontrado')

module.exports = {
    listar(fornecedor_id) {
        return modelo.findAll({
            where: {
                fornecedor: fornecedor_id
            }
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
    atualizar(produto_id, fornecedor_id, dados) {
        return modelo.update(dados, {
            where: {
                id: produto_id,
                fornecedor: fornecedor_id
            },
            raw: true
        })
    }
}