class ValorNaoSuportado extends Error {
    constructor(contentType) {
        super(`O tipo '${contentType}' nao é suportado pela aplicação`)
        this.name = "ValorNaoSuportado"
        this.idErro = 3
    }
}
module.exports = ValorNaoSuportado