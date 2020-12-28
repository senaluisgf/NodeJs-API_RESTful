class NaoEncontrado extends Error {
    constructor() {
        super("Fornecedor Não encontrado!")
        this.name = "NaoEncontrado"
        this.idErro = 0
    }
}
module.exports = NaoEncontrado