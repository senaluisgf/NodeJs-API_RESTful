const TabelaFornecedores = require('./tabelaFornecedores')
const CampoInvalido = require('../../erros/CampoInvalido')
const DadosNaoFornecidos = require('../../erros/DadosNaoFornecidos')

class Fornecedor {
    constructor({ id, empresa, email, categoria, dataCriacao, dataAtualizacao, versao }) {
        this.id = id
        this.empresa = empresa
        this.email = email
        this.categoria = categoria
        this.dataCriacao = dataCriacao
        this.dataAtualizacao = dataAtualizacao
        this.versao = versao
    }
    validar() {
        const campos = ['empresa', 'email', 'categoria']
        campos.forEach(campo => {
            const valor = this[campo]
            if (typeof valor !== 'string' || valor.length < 1) {
                throw new CampoInvalido(campo)
            }
        })
    }

    async criar() {
        this.validar()
        const resultados = await TabelaFornecedores.inserir({
            empresa: this.empresa,
            email: this.email,
            categoria: this.categoria
        })
        this.id = resultados.id
        this.dataCriacao = resultados.dataCriacao
        this.dataAtualizacao = resultados.dataAtualizacao
        this.versao = resultados.versao
    }

    async carregar() {
        const encontrado = await TabelaFornecedores.pegarPorId(this.id)
        this.empresa = encontrado.empresa
        this.email = encontrado.email
        this.categoria = encontrado.categoria
        this.dataCriacao = encontrado.dataCriacao
        this.dataAtualizacao = encontrado.dataAtualizacao
        this.versao = encontrado.versao
    }

    async atualizar() {
        await TabelaFornecedores.pegarPorId(this.id)

        const campos = ['empresa', 'email', 'categoria']
        const dadosAtualizar = {}

        campos.forEach(campo => {
            const valor = this[campo]
            if (typeof valor === 'string' && valor.length > 0) {
                dadosAtualizar[campo] = valor
            }
        })

        if (Object.keys(dadosAtualizar).length == 0) {
            throw new DadosNaoFornecidos()
        }

        await TabelaFornecedores.atualizar(this.id, dadosAtualizar)
    }

    async deletar() {
        await TabelaFornecedores.deletar(this.id)
    }
}

module.exports = Fornecedor