import express from "express";
import prodsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import { __dirname } from "./path.js";
import path from 'path';
import multer from 'multer';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import ProductManager from "./routes/ProductManager.js"

const PORT = 8080
const app = express()

const productManager = new ProductManager()

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
app.use('/realtimeproducts', express.static(path.join(__dirname, '/public')))
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

//console.log(path.resolve(__dirname, './views'))
const upload = multer({ storage: storage })

//Server Socket.io
const io = new Server(serverExpress)
//const mensajes = []


io.on('connection', async (socket) => {
    console.log("Servidor Socket.io conectado")
    socket.on('mensajeConexion', (info) => {
        console.log(info)
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

    socket.on('addProduct', async (newProduct) => {
        await productManager.addProduct(newProduct)
        const products = await productManager.getProducts()
        socket.emit('dataProducts', products)
    })

    socket.on('realTimeProducts', async () => {
        const products = await productManager.getProducts()
        socket.emit('dataProducts', products)
    })

    socket.on('deleteProductCode', async (code) => {
        await productManager.deleteProductCode(code)
        const products = await productManager.getProducts()
        socket.emit('dataProducts', products)
    })
})

//Routes
app.use('/api/products', prodsRouter)
app.use('/api/carts', cartsRouter)

app.get('/static', (req, res) => {
    res.render('index', {
        css: "style.css",
        title: "Productos",
        js: "index.js"
    })
})

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {
        css: "products.css",
        title: "Administrar productos",
        js: "realTimeProducts.js"
    })
})

app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("Imagen subida")
})
//console.log(path.join(__dirname, '/public'))
