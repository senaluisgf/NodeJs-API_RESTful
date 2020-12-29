const DadosNaoFornecidos = require('../../../erros/DadosNaoFornecidos')
const CampoInvalido = require('../../../erros/CampoInvalido')
const tabelaProdutos = require('./tabelaProdutos')

class Produto {
    constructor({ id, titulo, preco, estoque, fornecedor, dataCriacao, dataAtualizacao, versao }) {
        this.id = id
        this.titulo = titulo
        this.preco = preco
        this.estoque = estoque
        this.fornecedor = fornecedor
        this.dataCriacao = dataCriacao
        this.dataAtualizacao = dataAtualizacao
        this.versao = versao
    }

    validar() {
        if (typeof this.titulo !== 'string' || this.titulo.length === 0) {
            throw new CampoInvalido('titulo')
        }
        if (typeof this.preco !== 'number' || this.preco <= 0) {
            throw new CampoInvalido('preco')
        }
    }

    async criar() {
        this.validar()
        const resultado = await tabelaProdutos.inserir({
            titulo: this.titulo,
            preco: this.preco,
            estoque: this.estoque,
            fornecedor: this.fornecedor
        })
        this.id = resultado.id
        this.estoque = resultado.estoque
        this.dataCriacao = resultado.dataCriacao
        this.dataAtualizacao = resultado.dataAtualizacao
        this.versao = resultado.versao
    }

    async carregar() {
        const encontrado = await tabelaProdutos.pegaPorId(this.id, this.fornecedor)
        this.titulo = encontrado.titulo
        this.preco = encontrado.preco
        this.estoque = encontrado.estoque
        this.dataCriacao = encontrado.dataCriacao
        this.dataAtualizacao = encontrado.dataAtualizacao
        this.versao = encontrado.versao
    }

    async atualizar() {
        await tabelaProdutos.pegaPorId(this.id, this.fornecedor)

        const campos = ['titulo', 'preco', 'estoque']
        const dadosAtualizar = {}

        campos.forEach(campo => {
            const valor = this[campo]
            if (valor !== undefined && valor !== "") {
                dadosAtualizar[campo] = valor
            }
        })

        if (Object.keys(dadosAtualizar).length == 0) {
            throw new DadosNaoFornecidos()
        } else {
            await tabelaProdutos.atualizar(this.id, this.fornecedor, dadosAtualizar)
        }
    }

    async apagar() {
        return await tabelaProdutos.remover(this.id, this.fornecedor)
    }
}

module.exports = Produto