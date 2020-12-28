class CampoInvalido extends Error{
    constructor(campo){
        super(`Campo '${campo}' nao possui informações válidas!`)
        this.name = "CampoInvalido"
        this.idErro = 1
    }
}

module.exports = CampoInvalido