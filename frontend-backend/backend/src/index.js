import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import initializePassport from './config/passport.js';
import { addLogger } from './config/logger.js'
import session, { Cookie } from 'express-session';
import MongoStore from 'connect-mongo';
//import multer from 'multer';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from "./path.js";
import path from 'path';
import router from './routes/index.routes.js'
import messageRouter from './routes/messages.routes.js';
import { messageModel } from './dao/models/messages.models.js';
import { productModel } from './dao/models/products.models.js';
import { userModel } from './dao/models/users.models.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

const whiteList = ['http://localhost:5173', 'http://localhost:8080']

const corsOptions = {
    origin: function(origin,callback){
        if(whiteList.indexOf(origin) != -1 || !origin){
            callback(null, true)
        } else {
            callback(new Error("Acceso denegado"))
        }
    },
    credentials: true,
    //methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}

const app = express()
const PORT = 8080

//Mongoose
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('BDD conectada'))
    .catch(() => console.log('Error en conexion a BDD'))

const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: "Documentación del curso Backend",
            description: "API CoderHouse Backend"
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

//Middleware    
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))
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
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(addLogger)

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/realtimeproducts', express.static(path.join(__dirname, '/public')))
app.use('/chat', express.static(path.join(__dirname, '/public')))
app.use('/login', express.static(path.join(__dirname, '/public')))
app.use('/registrate', express.static(path.join(__dirname, '/public')))
app.use('/logout', express.static(path.join(__dirname, '/public')))

//Routes
app.use('/', router)
app.use('/api/messages', messageRouter)


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
    socket.on('login', async (userLogin) => {
        const { email, password} = userLogin
        const user = await userModel.findOne({email: email})
        if(user){
            if (user.password == password) {
                session.login = true
                const loginCorrect = true
                const welcomeUser = user.first_name +" "+ user.last_name + ". Rol: " + user.rol
                console.log(welcomeUser)
                socket.emit('welcome', welcomeUser )
                socket.emit('loginStatus', loginCorrect)        
            } else {
                let loginCorrect = false
                socket.emit('loginStatus', loginCorrect)
            }
        } else {

        }
        
    })
})

app.get('/static', (req, res) => {
    res.render('index', {
        css: "style.css",
        title: "Productos",
        js: "index.js",
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

