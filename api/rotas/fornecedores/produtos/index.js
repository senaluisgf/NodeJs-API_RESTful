const roteador = require('express').Router({ mergeParams: true })
const tabelaProdutos = require('./tabelaProdutos')
const Produto = require('./produto')

const serializadorProduto = require('../../../serializador').SerializadorProduto

roteador.get('/', async (req, res) => {
    const produtos = await tabelaProdutos.listar(req.fornecedor.id)
    const serializador = new serializadorProduto(res.getHeader('Content-Type'))
    res.send(
        serializador.serializar(produtos)
    )
})

roteador.post('/', async (req, res, next) => {
    try {
        const fornecedor_id = req.fornecedor.id
        const dadosRecebidos = req.body
        const dados = Object.assign({}, dadosRecebidos, { fornecedor: fornecedor_id })
        const produto = new Produto(dados)
        await produto.criar()
        const serializador = new serializadorProduto(res.getHeader('Content-Type'))

        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('ETag', produto.versao)
        res.setHeader('Last-Modified', timestamp)
        res.setHeader(
            'Location',
            `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`
        )
        res.status(201).send(
            serializador.serializar(produto)
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
        const serializador = new serializadorProduto(
            res.getHeader('Content-Type'),
            ['preco', 'estoque', 'fornecedor', 'dataCriacao', 'dataAtualizacao', 'versao']
        )

        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('ETag', produto.versao)
        res.setHeader('Last-Modified', timestamp)
        res.send(
            serializador.serializar(produto)
        )
    } catch (erro) {
        next(erro)
    }
})

roteador.head('/:produto_id', async (req, res, next) => {
    try {
        const produto = new Produto({
            id: req.params.produto_id,
            fornecedor: req.fornecedor.id
        })
        await produto.carregar()

        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('ETag', produto.versao)
        res.setHeader('Last-Modified', timestamp)
        res.status(200)
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
        await produto.carregar()

        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('ETag', produto.versao)
        res.setHeader('Last-Modified', timestamp)
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

roteador.post('/:produto_id/diminuir-estoque', async (req, res, next) => {
    try {
        const ids = {
            id: req.params.produto_id,
            fornecedor: req.fornecedor.id
        }
        const produto = new Produto(ids)
        await produto.carregar()
        produto.estoque = produto.estoque - req.body.quantidade
        await produto.diminuirEstoque()
        await produto.carregar()

        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('ETag', produto.versao)
        res.setHeader('Last-Modified', timestamp)
        res.status(204).end()
    } catch (erro) {
        next(erro)
    }
})


module.exports = roteador