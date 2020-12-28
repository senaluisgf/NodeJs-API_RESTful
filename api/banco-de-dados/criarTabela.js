const ModeloTabela = require('../rotas/fornecedores/modeloTabelaFornecedores');

ModeloTabela
    .sync()
    .then(() => console.log("Tabela de Fornecedores criada com sucesso!"))
    .catch(console.log)