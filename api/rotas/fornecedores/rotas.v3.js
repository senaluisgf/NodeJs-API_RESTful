const roteador = require('express').Router()
const SerializadorFornecedor = require('../../serializador').SerializadorFornecedor
const Fornecedor = require('./fornecedor')

roteador.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
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

module.exports = roteador