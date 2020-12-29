class NaoEncontrado extends Error {
    constructor(entidade) {
        super(`${entidade} Não encontrado!`)
        this.name = "NaoEncontrado"
        this.idErro = 0
    }
}
module.exports = NaoEncontrado