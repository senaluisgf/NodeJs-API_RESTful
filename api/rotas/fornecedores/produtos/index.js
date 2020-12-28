const roteador = require('express').Router({ mergeParams: true })
const tabelaProdutos = require('./tabelaProdutos')

const serializador = require('../../../serializador')

roteador.get('/', async (req, res) => {
    const produtos = await tabelaProdutos.listar(req.params.fornecedor_id)
    res.send(
        JSON.stringify(produtos)
    )
})

roteador.post('/', (req, res) => {
    res.send(
        JSON.stringify(req.body)
    )
})

roteador.get('/:id', (req, res) => {
    res.send(
        JSON.stringify(req.params.id)
    )
})

roteador.put('/:id', (req, res) => {
    res.send(
        JSON.stringify(Object.assign({ id: req.params.id }, req.body))
    )
})

roteador.delete('/:id', (req, res) => {
    res.send(
        JSON.stringify(req.params.id)
    )
})


module.exports = roteador