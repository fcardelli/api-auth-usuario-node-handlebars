var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport, usuario) {
    var Usuario = usuario;
    var LocalStrategy = require('passport-local').Strategy;

    passport.serializeUser( function(usuario, done) {
        done(null, usuario.id);
    });

    passport.deserializeUser(function(id, done) {
        Usuario.findByPk(id).then(function(usuario) {
            if (usuario)
                done(null, usuario.get());
            else    
                done(usuario.errors, null);
        });
        
    });
    
    //Local SignUP
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'senha',
        passReqToCallback: true // Permite enviar o request inteiro por call back
    },

    function (req, email, senha, done) {
        var generateHash = function (senha) {
            return bCrypt.hashSync(senha, bCrypt.genSaltSync(8), null);
        }

        Usuario.findOne({
            where: {
                email: email
            }
        }).then(function(usuario) {
            if( usuario ){
                return done(null, false, {
                    message: 'O e-mail utilizado já existe em nossa base. Por favor, tente outro e-mail. '
                })
            }else {
                var usuarioSenha = generateHash(senha);

                var data = {
                    email: email,
                    senha : usuarioSenha,
                    nome: req.body.nome,
                    sobrenome: req.body.sobrenome
                };

                Usuario.create(data).then(function(novoUsuario, created){
                    if(!novoUsuario) {
                        return done(null, false);
                    }else {
                        return done(null, novoUsuario);
                    }
                });
            }
        }); 
    }
    ));
    //Local SignIN
    passport.use('local-signin', new LocalStrategy(
        {
            //Por padrão o usuario será substituido pelo campo e-mail
            usernameField: 'email',
            passwordField: 'senha',
            passReqToCallback: true //Permite passar toda a requisão por callback
        },
        function (req, email, senha, done) {
            var Usuario = usuario;
            var isValidPassword = function( senhaUsuario, senha ) {
                return bCrypt.compareSync(senha, senhaUsuario);
            }

            Usuario.findOne({
                where: {
                    email: email
                }
            }).then(function(usuario) {
                if (!usuario){
                    return done(null, false, {
                        message: 'O e-mail não existe.'
                    });
                }
                
                if (!isValidPassword(usuario.senha, senha)) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }

                var usuarioInformacao = usuario.get();

                return done(null, usuarioInformacao);
            }).catch( function(erro) {
                console.log("Erro: ", erro);

                return done(null, false, {
                    message: 'Alguma coisa não deu certo ao tentar realizar o login'
                });
            });
        }
    ));   
}
