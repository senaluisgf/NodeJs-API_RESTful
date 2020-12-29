const ValorNaoSuportado = require("./erros/ValorNaoSuportado")
const jsontoxml = require("jsontoxml")

class Serializador {
    json(dados) {
        return JSON.stringify(dados)
    }

    xml(dados) {
        let tag = this.tagSingular
        if (Array.isArray(dados)) {
            tag = this.tagPlural
            dados = dados.map(fornecedor => {
                return {
                    [this.tagSingular]: fornecedor
                }
            })
        }
        return jsontoxml({ [tag]: dados })
    }

    serializar(dados) {
        dados = this.filtrar(dados)
        if (this.contentType === 'application/json') {
            return this.json(dados)
        }
        if (this.contentType === 'application/xml') {
            return this.xml(dados)
        }
        throw new ValorNaoSuportado(this.contentType)
    }

    filtrarObjeto(dados) {
        const objetoFiltrado = {}
        this.camposPublicos.forEach(campo => {
            if (dados.hasOwnProperty(campo)) {
                objetoFiltrado[campo] = dados[campo]
            }
        });
        return objetoFiltrado;
    }

    filtrar(dados) {
        if (Array.isArray(dados)) {
            const resultados = dados.map((objeto) => { return this.filtrarObjeto(objeto) });
            return resultados;
        } else {
            return this.filtrarObjeto(dados)
        }
    }
}

class SerializadorFornecedor extends Serializador {
    constructor(contentType, extras) {
        super()
        this.contentType = contentType
        this.camposPublicos = ['id', 'empresa', 'categoria'].concat(extras || [])
        this.tagSingular = 'fornecedor'
        this.tagPlural = 'fornecedores'
    }
}

class SerializadorErro extends Serializador {
    constructor(contentType, extras) {
        super()
        this.contentType = contentType
        this.camposPublicos = ['name', 'mensagem', 'id'].concat(extras || [])
        this.tagSingular = 'erro'
        this.tagPlural = 'erros'
    }
}

class SerializadorProduto extends Serializador {
    constructor(contentType, extras) {
        super()
        this.contentType = contentType
        this.camposPublicos = ['id', 'titulo', 'preco', 'estoque'].concat(extras || [])
        this.tagSingular = 'produto'
        this.tagPlural = 'produtos'
    }
}

module.exports = {
    Serializador: Serializador,
    SerializadorFornecedor: SerializadorFornecedor,
    SerializadorErro: SerializadorErro,
    SerializadorProduto: SerializadorProduto,
    formatosAceitos: ['*/*', 'application/json', 'application/xml']
}