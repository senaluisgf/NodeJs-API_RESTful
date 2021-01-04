const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')

const rotasFornecedores = require('./rotas/fornecedores/index')
const rotasFornecedoresV2 = require('./rotas/fornecedores/rotas.v2')
const rotasFornecedoresV3 = require('./rotas/fornecedores/rotas.v3')

const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const formatosAceitos = require('./serializador').formatosAceitos
const SerializadorErro = require('./serializador').SerializadorErro

app.use(bodyParser.json())

app.use((req, res, next) => {
    let formatoRequisitado = req.header("Accept")

    if (formatoRequisitado === '*/*') {
        formatoRequisitado = 'application/json'
    }
    if (formatosAceitos.indexOf(formatoRequisitado) === -1) {
        throw new ValorNaoSuportado(formatoRequisitado)
    } else {
        res.setHeader('Content-Type', formatoRequisitado)
        next()
    }
})

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*')
    next()
})

app.use((req, res, next) => {
    res.set('X-Powered-By', 'Gatito Petshop')
    next()
})

app.use('/api/fornecedores', rotasFornecedores)
app.use('/api/v2/fornecedores', rotasFornecedoresV2)
app.use('/api/v3/fornecedores', rotasFornecedoresV3)

app.use((erro, req, res, next) => {
    let status = 500
    if (erro instanceof NaoEncontrado) {
        status = 404
    }
    if (erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos) {
        status = 400
    }
    if (erro instanceof ValorNaoSuportado) {
        status = 406
    }
    const serializador = new SerializadorErro(res.getHeader('Content-Type'))
    res.status(status)
    res.send(
        serializador.serializar({
            name: erro.name,
            mensagem: erro.message,
            id: erro.idErro
        })
    )
})

app.listen(config.get("api.porta"), () => console.log("A API esta funcionando!"))