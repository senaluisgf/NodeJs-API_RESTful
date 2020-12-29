const roteador = require('express').Router({ mergeParams: true })
const tabelaProdutos = require('./tabelaProdutos')
const Produto = require('./produto')

const serializador = require('../../../serializador')

roteador.get('/', async (req, res) => {
    const produtos = await tabelaProdutos.listar(req.fornecedor.id)
    res.send(
        JSON.stringify(produtos)
    )
})

roteador.post('/', async (req, res, next) => {
    try {
        const fornecedor_id = req.fornecedor.id
        const dadosRecebidos = req.body
        const dados = Object.assign({}, dadosRecebidos, { fornecedor: fornecedor_id })
        const produto = new Produto(dados)
        await produto.criar()
        res.status(201).send(
            JSON.stringify(produto)
        )
    } catch (erro) {
        next(erro)
    }
})

roteador.get('/:produto_id', async (req, res, next) => {
    try {
        const dados = {
            id: req.params.produto_id,
            fornecedor: req.fornecedor.id
        }
        const produto = new Produto(dados)
        await produto.carregar()
        res.send(
            JSON.stringify(produto)
        )
    } catch (erro) {
        next(erro)
    }
})

roteador.put('/:produto_id', async (req, res, next) => {
    try {
        const ids = {
            id: req.params.produto_id,
            fornecedor: req.fornecedor.id
        }
        const dados = Object.assign({}, ids, req.body)
        const produto = new Produto(dados)
        await produto.atualizar()
        res.status(204).end()
    } catch (erro) {
        next(erro)
    }
})

roteador.delete('/:produto_id', async (req, res, next) => {
    try {
        const dados = {
            id: req.params.produto_id,
            fornecedor: req.fornecedor.id
        }
        const produto = new Produto(dados)
        await produto.carregar()
        await produto.apagar()

        res.status(204).end()
    } catch (erro) {
        next(erro)
    }
})


module.exports = roteador