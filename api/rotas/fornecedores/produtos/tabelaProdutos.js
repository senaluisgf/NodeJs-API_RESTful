const modeloTabelaFornecedores = require("../modeloTabelaFornecedores")
const { deletar } = require("../tabelaFornecedores")

const modelo = require('./modeloTabelaProdutos')

module.exports = {
    listar(fornecedor_id) {
        return modelo.findAll({
            where: {
                fornecedor: fornecedor_id
            }
        })
    }
    // inserir(produto){
    //     return modelo.create(produto)
    // },
    // pegaPorId(id){
    //     return modelo.findOne({
    //         where: {
    //             id:id
    //         }
    //     })
    // },
    // atualizar(id, dados){
    //     await this.pegaPorId(id)
    //     return modelo.update(dados, {
    //         where: {
    //             id: id
    //         }
    //     })
    // },
    // deletar(id){

    // }
}