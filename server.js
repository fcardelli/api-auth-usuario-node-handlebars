var express = require('express');
var app = express();
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var env = require('dotenv');
var hbs = require('express-handlebars');

//Inicializando o Body Parser e setando o tipo corpo de requisição
// como json
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//Inicializando middleware Passport e Express Session

//Setando o secredo da chave e parametros de configuração
app.use(session({  secret: 'keyboard cat', resave: true, saveUninitialized: true }));

//Inicializando o passport
app.use(passport.initialize());

//Inicializando persistencia de sessão
app.use(passport.session());

//Inicializando Handlebars
app.set('views', './views')
app.engine('hbs', hbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Requisição get Inicial para Teste de Abertura de servidor express
app.get('/' , function(req, res) {
    res.send('Bem vindo ao Passport com Sequelize e Mysql')
});

//Models
var models = require("./models");

//Importando rota de Autenticação de Usuario
var authRoute = require('./routes/auth.js')(app, passport);

//Importando estratégia do Passport da rotade usuario
require('./config/passport/passport.js')(passport, models.usuario);

//Sincronizando models com a Bando de dados
models.sequelize.sync().then(function() {
    console.log("A base de dados foi sincronizada com êxito!")
}).catch(function(erro) {
    console.log(erro,"Alguma coisa deu errado ao atualizar  o banco de dados!")
});

app.listen(5000, function(erro) {
    if(!erro)
        console.log("Servidor está ativo");
    else
        console.log(erro);
});

