const roteador = require('express').Router()
const TabelaFornecedores = require('./tabelaFornecedores')
const Fornecedor = require('./fornecedor')
const SerializadorFornecedor = require('../../serializador').SerializadorFornecedor

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

roteador.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const fornecedor = new Fornecedor({ id: id })
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

roteador.put('/:id', async (req, res, next) => {
    try {

        const id = req.params.id
        const dados = Object.assign({}, req.body, { id: id })
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar()

        res.status(204).end()

    } catch (erro) {
        next(erro)
    }

})

roteador.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const fornecedor = new Fornecedor({ id })
        await fornecedor.carregar()
        await fornecedor.deletar()

        res.status(204).end()
    } catch (erro) {
        next(erro)
    }
})

module.exports = roteador