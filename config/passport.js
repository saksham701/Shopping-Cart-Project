const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');
const bcrypt = require('bcryptjs');


module.exports = function (passport) {
    
    passport.use(new LocalStrategy((username, password, done)=> {
        User.findOne({ username: username }, (err, user) => {
            if (err) console.error(err);
            
            else {
                if (!user) {
                    return done(null,false, { message: 'No User Found!' });
                    
                }
                bcrypt.compare(password, user.password, (err, match) => {
                    if (err) console.error(err);

                    if (match) {
                        return done(null, user);
                    }
                    else {
                        return done(null,false, { message: 'Wrong Password!' });
                    }
                })
            }
        })
    }))
    passport.serializeUser((user, done) => {
        done(null, user.id);
    })
    
    passport.deserializeUser((id, done) => {
        
        User.findById(id, (err, user) => {
            done(err, user);
        })
    })
}

