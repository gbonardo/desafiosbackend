import express from "express";
import prodsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import { __dirname } from "./path.js";
import path from 'path';
import multer from 'multer';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { Socket } from "dgram";
import { SocketAddress } from "net";

const PORT = 8080
const app = express()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`)
    }
})

const serverExpress = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/static', express.static(path.join(__dirname, '/public')))
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))
//console.log(path.resolve(__dirname, './views'))
const upload = multer({ storage: storage })

//Server Socket.io
const io = new Server(serverExpress)
const mensajes = []

io.on('connection', (socket) => {
    console.log("Servidor Socket.io conectado")
    socket.on('mensajeConexion', (user) => {
        //console.log(info)
        if (user.rol === "Admin") {
            socket.emit('credencialesConexion', "Usuario valido")
        } else {
            socket.emit('credencialesConexion', "Usuario no valido")
        }
    })

    socket.on('mensaje', (infoMensaje) => {
        console.log(infoMensaje)
        mensajes.push(infoMensaje)
        socket.emit('mensajes', mensajes)
    })
})

//Routes
app.use('/api/products', prodsRouter)
app.use('/api/carts', cartsRouter)

/*
app.get('/static', (req,res) => {
    const user = {
        nombre: "Julia",
        cargo: "Tutor"
    }
    const cursos = [
        {numCurso: 123, dia: "S", horario: "Mañana" },
        {numCurso: 456, dia: "MyJ", horario: "Tarde" },
        {numCurso: 789, dia: "LyM", horario: "Noche" }
    ]
    res.render('home', {
        user: user,
        css: "style.css",
      //css: "products.css",
      //title: "Productos"
        title: "Home",
        esTutor: user.cargo === "Tutor",
        cursos: cursos
    })
})
*/

app.get('/static', (req, res) => {
    res.render('chat', {
        css: "style.css",
        title: "Chat"

    })
})

app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("Imagen subida")
})
//console.log(path.join(__dirname, '/public'))
