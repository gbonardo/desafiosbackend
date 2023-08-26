import { Router } from "express";
import CartManager from "./CartManager.js";

const cartManager = new CartManager()
const cartsRouter = Router()

cartsRouter.post('/', async (req, res) => {
    const { cid } = req.params
    const carts = await cartManager.getCarts()
    const carrito = carts.find(cart => cart.cid === parseInt(cid))
    if (carrito) {
        res.status(400).send("Carrito ya existente")
    } else {
        await cartManager.addCart(req.body)
        res.status(200).send("Carrito creado")
    }
})
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    const { cid } = req.params
    const { pid } = req.params
    const { quantity } = req.body
    const productos = { quantity }
    const carts = await cartManager.getCarts()
    const carritoIndex = carts.findIndex(cart => cart.cid === parseInt(cid))
    if (carritoIndex != -1) {
        if (parseInt(pid)) {
            await cartManager.updateCart(parseInt(cid), productos)
            res.status(200).send("Producto agregado")
        } else {
            res.status(404).send("El producto no existe.")
        }
    } else {
        res.status(404).send("El carrito no existe.")
    }
})
cartsRouter.get('/:cid', async (req, res) => {
    const { cid } = req.params
    const cart = await cartManager.getCartById(parseInt(cid))
    if (cart) {
        res.status(200).send(cart)
    } else {
        res.status(404).send("Carrito no encontrado.")
    }
})

export default cartsRouter