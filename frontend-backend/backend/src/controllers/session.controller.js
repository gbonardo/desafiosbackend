import { generateToken } from "../utils/jwt.js";

export const login = async (req,res) => {
    try {
        if(!req.user){
        return res.status(401).send({ mensaje: `Usuario invalido`})
        }
        
        /*
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age_name: req.user.age,
            email: req.user.email
            res.status(200).send({mensaje: "Usuario logueado"})
        }
        */

        const token = generateToken(req.user)
        /*res.cookie('jwtCookie', token, {
            maxAge: 43200000 //12hs
        })
        */
        res.status(200).send({ token })

    } catch(error){
        res.status(500).send({ mensaje: `Error al iniciar sesion ${error}` })
    }
}

export const register = async (req,res) => {
    try {
        if (!req.user) {
            return res.status(400).send({ mensaje: "Usuario existente" })
        }

        res.status(200).send({ mensaje: "Usuario registrado" })

    } catch (error) {
        res.status(500).send({ mensaje: `Error al registrar usuario ${error}` })
    }
}

export const logout = async (req, res) => {
    /*if (req.session.login) {
        req.session.destroy()
    }*/
    res.clearCookie('jwtCookie')
    res.status(200).send({ resultado: 'Usuario deslogueado' })
}