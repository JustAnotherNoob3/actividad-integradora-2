import passport from "passport";
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import { userModel } from '../dao/models/users.js';
import { createHash, isValidPassword } from "../utils.js";
import cartManager from '../dao/Managers/CartManager.js';
import { isObjectIdOrHexString } from "mongoose";

const LocalStrategy = local.Strategy;
const  initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                let user = await userModel.findOne({email:username});
                if(user){
                    console.log("User already exist");
                    return done(null, false);
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password:createHash(password),
                    cart: await cartManager.createNewCart(),
                    role: "user"
                };
                let result = await userModel.create(newUser);
                return done(null,result);
            } catch (error){
                return done("Error when obtaining user:" + error)
            }
        }
    ));
    passport.use('login', new LocalStrategy({usernameField:'email'}, async (username, password, done) => {
        try {
            if (username == "adminCoder@coder.com" && password == "adminCod3r123") {
                let sussy = {
                    _id: new ObjectId(),
                    name: `Admin`,
                    email: user.email,
                    age: "99",
                    cart: await cartManager.createNewCart(),
                    role: "admin"
                }
                return done(null, sussy)
            }
            let user = await userModel.findOne({email:username});
            if(!user){
                console.log("User doesn't exist");
                return done(null, false);
            }
            if(!isValidPassword(user, password)) return done(null, false);
            console.log(user)
            return done(null,user);
        } catch (error){
            return done(error)
        }
    }))
    passport.use(
        "github",
        new GitHubStrategy(
          {
            clientID: "Iv1.b1b481dd43d71d1b", 
            clientSecret: "49cfea97f63f7c13207ad1f025a2092664ff3978", 
            callbackURL: "http://localhost:8080/api/sessions/githubcallback"
          },
          async (accessToken, refreshToken, profile, done) => {
            try {
              console.log(profile); 
              const user = await userModel.findOne({
                email: profile._json.email,
              });
              if (!user) {
                const newUser = {
                  first_name: profile._json.name,
                  last_name: "",
                  age: 18,
                  email: profile._json.email,
                  password: "",
                  cart: await cartManager.createNewCart(),
                  role: "user"
                };
                let createdUser = await userModel.create(newUser);
                done(null, createdUser);
              } else {
                done(null, user);
              }
            } catch (error) {
              return done(error);
            }
          }
        )
      );
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });
}
export default initializePassport;