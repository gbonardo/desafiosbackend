import 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
//import multer from 'multer';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from "./path.js";
import path from 'path';
import userRouter from './routes/users.routes.js';
import productRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';
import messageRouter from './routes/messages.routes.js';
import sessionRouter from './routes/session.routes.js';
import { messageModel } from './dao/models/messages.models.js';
import { productModel } from './dao/models/products.models.js';
import { userModel } from './dao/models/users.models.js';


const app = express()
const PORT = 8080

//Mongoose
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('BDD conectada'))
    .catch(() => console.log('Error en conexion a BDD'))

/*
const auth = (req, res, next) => {
    if (req.session.email == "admin@admin.com" && req.session.password === "1234") {
        return next()
    }
    res.send("No tenes acceso a esta ruta.")
}
*/

//Middleware    
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.SIGNED_COOKIE))
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 60
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/realtimeproducts', express.static(path.join(__dirname, '/public')))
app.use('/chat', express.static(path.join(__dirname, '/public')))
app.use('/login', express.static(path.join(__dirname, '/public')))
app.use('/registrate', express.static(path.join(__dirname, '/public')))

//Routes
app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/messages', messageRouter)
app.use('/api/sessions', sessionRouter)
/* 
app.get('/setCookie', (req, res) => {
    res.cookie('CookieCookie', 'Esto es una cookie', { maxAge: 90000, signed: true }).send('Cookie generada')
})
app.get('/getCookie', (req, res) => {
    res.send(req.cookies)
})
app.get('/session', (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        res.send(`Se ha visitado el sitio ${req.session.counter} veces.`)
    } else {
        req.session.counter = 1;
        res.send('¡Bienvenido!')
    }
})
app.get('/login', (req, res) => {
    const { email, password } = req.body

    req.session.email = email
    req.session.password = password
    console.log(req.session.email)
    console.log(req.session.password)

    res.send('Usuario logueado')
})
app.get('/admin', auth, (req, res) => {
    res.send('Sos admin')
})
*/

//Routes
//app.use('/api/products', prodsRouter)
//app.use('/api/carts', cartsRouter)

const serverExpress = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

//Server Socket.io
const io = new Server(serverExpress)

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

    socket.on('newMessage', async ({ email, mensaje }) => {
        console.log(mensaje)
        await messageModel.create({ email: email, message: mensaje })
        const messages = await messageModel.find()
        socket.emit("showMessages", messages)
    })

    socket.on('loadChats', async () => {
        const messages = await messageModel.find()
        socket.emit("showMessages", messages)
    })

    socket.on('addProduct', async (newProduct) => {
        const { title, description, price, stock, category, code, thumbnail } = newProduct
        await productModel.create({ title, description, price, stock, category, code, thumbnail })
        //await productManager.addProduct(newProduct)
        //const products = await productManager.getProducts()
        const products = await productModel.find();
        socket.emit('dataProducts', products)
    })

    socket.on('realTimeProducts', async () => {
        const products = await productModel.find();
        socket.emit('dataProducts', products)
    })

    socket.on('deleteProductCode', async (code) => {
        await productModel.findOneAndDelete(code)
        const products = await productModel.find();
        socket.emit('dataProducts', products)
    })

    socket.on('addUser', async (newUser) => {
        const { first_name, last_name, age, email, password } = newUser
        const user = await userModel.findOne({email: email})
        console.log(user)
        console.log(email)
        if(user == null){
            await userModel.create({ first_name, last_name, age, email, password })
            let errorUser = false
            socket.emit('error', errorUser)
        } else {
            console.log("El correo ya se esta utilizando.")
            let errorUser = true
            socket.emit('error', errorUser)
        }
    })
    
})


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

app.get('/chat', (req, res) => {
    res.render('chat', {
        css: 'style.css',
        title: 'Chat',
        js: 'chat.js',
    });
});

app.get('/login', (req,res) => {
    res.render('login', {
        css: 'style.css',
        title: 'Login',
        js: 'login.js'
    })
})

app.get('/registrate', (req,res) => {
    res.render('registrate', {
        css: 'style.css',
        title: 'Registrate',
        js: 'registrate.js'
    })
})

//Storage
/*
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}${file.originalname}`)
        }
    })
const upload = multer({ storage: storage })
*/

/*
app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("Imagen subida")
})
//console.log(path.join(__dirname, '/public'))
*/