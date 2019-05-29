var authController = require('../controllers/authcontroller.js');
var passport = require('passport'); 
module.exports = function(app) {
    
    app.get('/signup', authController.signup);

    app.get('/signin', authController.signin);

    app.get('/dashboard',isLoggedIn, authController.dashboard);

    app.get('/logout', authController.logout);

    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/dashboard',
            failureRedirect: '/signup'
        }
    ));

    app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/dashboard',
        failureRedirect: '/signin'
    }));

    //Verifica se o usuário está autenticado
    function isLoggedIn(req, res, next){
        if(req.isAuthenticated())
            return next();
        else
            res.redirect('/signin');
    }
    
 
}