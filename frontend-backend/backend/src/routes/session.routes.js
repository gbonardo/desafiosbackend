import { Router } from "express";
import passport from "passport";
import { passportError, authorization } from "../utils/messagesError.js";
//import { generateToken } from "../utils/jwt.js";
import { login, register, logout } from "../controllers/session.controller.js";

const sessionRouter = Router()

sessionRouter.post('/login', passport.authenticate('login'), login)
sessionRouter.post('/register', passport.authenticate('register'), register)
sessionRouter.get('/logout', logout)

sessionRouter.get('/user', (req, res) => {
    if (req.session.login) {
        const user = req.session.login
        res.status(200).send(user)
    }
})

/*
sessionRouter.get('/testJWT', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req)
    res.send(req.user)
})
*/

sessionRouter.get('/current', passportError('jwt'), authorization('Admin'), (req, res, next) => {
    res.send(req.user)
})

//GITHUB

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    res.status(200).send({ mensaje: 'Usuario registrado' })
})

sessionRouter.get('/githubCallback', passport.authenticate('github'), async (req, res) => {
    req.session.user = req.user
    res.status(200).send({ mensaje: 'Usuario logueado' })
})


export default sessionRouter