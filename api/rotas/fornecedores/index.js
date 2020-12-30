const roteador = require('express').Router()
const TabelaFornecedores = require('./tabelaFornecedores')
const Fornecedor = require('./fornecedor')
const SerializadorFornecedor = require('../../serializador').SerializadorFornecedor
const RotasProdutos = require('./produtos/index')
const tabelaProdutos = require('./produtos/tabelaProdutos')

roteador.get('/', async (req, res) => {
    const resultados = await TabelaFornecedores.listar()
    const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'))

    res.send(
        serializador.serializar(resultados)
    )
})

roteador.post('/', async (req, res, next) => {
    try {
        const fornecedor = new Fornecedor(req.body)
        await fornecedor.criar()
        const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'))
        res.send(
            serializador.serializar(fornecedor)
        )
    } catch (erro) {
        next(erro)
    }
})

roteador.get('/:fornecedor_id', async (req, res, next) => {
    try {
        const fornecedor_id = req.params.fornecedor_id
        const fornecedor = new Fornecedor({ id: fornecedor_id })
        await fornecedor.carregar()
        const serializador = new SerializadorFornecedor(
            res.getHeader('Content-Type'),
            ['email', 'dataCriacao', 'dataAtualizacao', 'versao']
        )
        res.send(
            serializador.serializar(fornecedor)
        )
    } catch (erro) {
        next(erro)
    }
})

roteador.put('/:fornecedor_id', async (req, res, next) => {
    try {

        const fornecedor_id = req.params.fornecedor_id
        const dados = Object.assign({}, req.body, { id: fornecedor_id })
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar()

        res.status(204).end()

    } catch (erro) {
        next(erro)
    }

})

roteador.delete('/:fornecedor_id', async (req, res, next) => {
    try {
        const fornecedor_id = req.params.fornecedor_id
        const fornecedor = new Fornecedor({ id: fornecedor_id })
        await fornecedor.carregar()
        await fornecedor.deletar()

        res.status(204).end()
    } catch (erro) {
        next(erro)
    }
})

roteador.post('/:fornecedor_id/calcular-reposicao-de-estoque', async (req, res, next) => {
    try {
        const fornecedor_id = req.params.fornecedor_id
        const fornecedor = new Fornecedor({ id: fornecedor_id })
        await fornecedor.carregar()
        const produtos = await tabelaProdutos.listar(fornecedor.id, { estoque: 0 })
        res.send(
            { mensagem: `${produtos.length} Produtos precisam ser reabastecidos` }
        )
    } catch (erro) {
        next(erro)
    }
})

const verificaFornecedor = async (req, res, next) => {
    try {
        const fornecedor_id = req.params.fornecedor_id
        const fornecedor = new Fornecedor({ id: fornecedor_id })
        await fornecedor.carregar()
        req.fornecedor = fornecedor
        next()
    } catch (erro) {
        next(erro)
    }
}

roteador.use('/:fornecedor_id/produtos', verificaFornecedor, RotasProdutos)

module.exports = roteador