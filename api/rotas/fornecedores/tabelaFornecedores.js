const NaoEncontrado = require('../../erros/NaoEncontrado')
const ModeloTabelaFornecedores = require('./modeloTabelaFornecedores')

module.exports = {
    listar() {
        return ModeloTabelaFornecedores.findAll({ raw: true })
    },
    inserir(fornecedor) {
        return ModeloTabelaFornecedores.create(fornecedor)
    },
    async pegarPorId(id) {
        const encontrado = await ModeloTabelaFornecedores.findOne({
            where: {
                id: id
            }
        })

        if (!encontrado) {
            throw new NaoEncontrado("Fornecedor")
        }
        return encontrado

    },
    atualizar(id, dadosAtualizar) {
        return ModeloTabelaFornecedores.update(dadosAtualizar, {
            where: {
                id: id
            }
        })
    },
    deletar(id) {
        return ModeloTabelaFornecedores.destroy({
            where: {
                id: id
            }
        })
    }
}