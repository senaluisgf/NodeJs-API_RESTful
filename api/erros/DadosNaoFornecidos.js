class DadosNaoFornecidos extends Error {
    constructor() {
        super("Voce deve informar corretamente os campos a serem atualizados")
        this.name = "DadosNaoFornecidos"
        this.idErro = 2
    }
}
module.exports = DadosNaoFornecidos