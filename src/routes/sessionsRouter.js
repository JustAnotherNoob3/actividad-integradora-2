import { Router } from "express";
import { userModel } from '../dao/models/users.js';
import { __dirname, isValidPassword } from "../utils.js";
import { createHash } from "../utils.js";
import passport from "passport";
const sessionsRouter = Router();

sessionsRouter.get("/logout", async (req, res) => {
    req.session.destroy(err => {
        if (err) return res.json({ status: "error", error: err });
        res.send({ status: "success" })
    })
});

sessionsRouter.post("/register", passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
    res.status(201).send({ status: "success", payload: req.result })
});
sessionsRouter.get('/failregister', async (req, res) => {
    res.status(400).send({ status: "error", error: "register failed" });
})
sessionsRouter.post("/login", passport.authenticate('login', { failureRedirect: '/faillogin' }), async (req, res) => {
    req.session.user = {
        name: req.user.first_name + " " + req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        cart: req.user.cart.toString(),
        role: req.user.role
    }
    res.send({ status: "success", payload: req.session.user, message: "Inicio Exitoso" });
});
sessionsRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    console.log("GitHub authentication initiated");
})

sessionsRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    console.log("GitHub callback triggered");
    console.log(req.user);
    req.session.user = {
        name: req.user.first_name,
        email: req.user.email,
        age: req.user.age,
        cart: req.user.cart.toString(),
        role: req.user.role
    }
    console.log(req.session.user);

    return res.redirect('/products');
})

sessionsRouter.get('/faillogin', async (req, res) => {
    res.status(401).send({ status: "error", error: "Login failed" });
})
export default sessionsRouter;
