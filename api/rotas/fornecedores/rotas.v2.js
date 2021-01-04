const roteador = require('express').Router()
const tabelaFornecedores = require('./tabelaFornecedores')
const SerializadorFornecedor = require('../../serializador').SerializadorFornecedor

roteador.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
})

roteador.get('/', async (req, res, next) => {
    try {
        const fornecedores = await tabelaFornecedores.listar()
        const serializador = new SerializadorFornecedor(res.getHeader("Content-Type"), ['categoria'])
        res.send(
            serializador.serializar(fornecedores)
        )
    } catch (error) {
        next(erro)
    }
})

module.exports = roteador