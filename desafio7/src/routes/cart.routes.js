import { Router } from "express";
import { cartModel } from "../dao/models/carts.models.js";
import { productModel } from "../dao/models/products.models.js";

const cartRouter = Router()

cartRouter.get('/:cid', async (req, res) => {
    const { cid } = req.params
    try {
        const cart = await cartModel.findById(cid)
        if (cart)
            res.status(200).send({ respuesta: 'Ok', mensaje: cart })
        else
            res.status(404).send({ respuesta: 'Error en consultar Carrito', mensaje: 'No encontrado' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consulta carrito', mensaje: error })
    }
})

cartRouter.post('/', async (req, res) => {
    try {
        const cart = await cartModel.create({})
        res.status(200).send({ respuesta: 'Ok', mensaje: cart })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en crear Carrito', mensaje: error })
    }
})

cartRouter.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body
    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            const prod = await productModel.findById(pid)
            if (prod) {
                const indice = cart.products.findIndex(item => item.id_prod === pid)
                if (indice != -1) {
                    cart.products[indice].quantity = quantity
                } else {
                    cart.products.push({ id_prod: pid, quantity: quantity })
                }
                const respuesta = await cartModel.findByIdAndUpdate(cid, cart)
                res.status(200).send({ respuesta: 'Ok', mensaje: respuesta })
            } else {
                res.status(404).send({ respuesta: 'Error en agregar producto Carrito', mensaje: 'Producto no encontrado' })
            }
        } else {
            res.status(404).send({ respuesta: 'Error en agregar producto Carrito', mensaje: 'CCarrito no encontrado' })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ respuesta: 'Error en agregar producto Carrito', mensaje: error })
    }
})

cartRouter.put('/:cid', async (req, res) => {
    const { cid } = req.params
    const productsArray = req.body.products
    if (!Array.isArray(productsArray)) {
        return res.status(400).send({ respuesta: 'Error', mensaje: 'Los productos deben ser un array' })
    }
    try {
        const cart = await cartModel.findById(cid)
        if (!cart) {
            throw new Error("Carrito no encontrado")
        }
        for (let prod of productsArray) {
            const indice = cart.products.findIndex(cartProduct => cartProduct.id_prod.toString() === prod.id_prod)
            if (indice !== -1) {
                cart.products[indice].quantity = prod.quantity
            } else {
                const existe = await productModel.findById(prod.id_prod)
                if (!existe) {
                    throw new Error(`Producto con el siguiente ID: ${prod.id_prod}, No encontrado`)
                }
                cart.products.push(prod)
            }
        }
        const respuesta = await cartModel.findByIdAndUpdate(cid, cart)
        res.status(200).send({ respuesta: 'Ok', mensaje: respuesta })
    } catch (error) {
        res.status(error.message.includes("No encontrado") ? 404 : 400).send({ respuesta: 'Error', mensaje: error.message })
    }
})

cartRouter.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body
    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            const prod = await productModel.findById(pid)
            if (prod) {
                const index = cart.products.findIndex(product => product.id_prod._id.toString() === pid)
                if (index !== -1) {
                    cart.products[index].quantity = quantity
                    const respuesta = await cartModel.findByIdAndUpdate(cid, cart) 
                    res.status(200).send({ respuesta: 'OK', mensaje: respuesta })
                } else {
                    cart.products.push({ id_prod: pid, quantity: quantity })
                }
                
            }
        }
    } catch (error) {
        res.status(error.message.includes("not found") ? 404 : 400).send({ respuesta: 'Error', mensaje: error.message })
    }
})

cartRouter.delete('/:cid', async (req, res) => {
    const { cid } = req.params
    try {
        await cartModel.findByIdAndUpdate(cid, { products: [] })
        res.status(200).send({ respuesta: 'Ok', mensaje: 'Carrito vacio' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Carrito no encontrado', mensaje: error })
    }
})

cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            const prod = await productModel.findById(pid)
            if (prod) {
                const indice = cart.products.findIndex(item => item.id_prod._id.toString() == pid)
                if (indice !== -1) {
                    cart.products.splice(indice, 1)
                }
            }
        }
        const respuesta = await cartModel.findByIdAndUpdate(cid, cart)
        res.status(200).send({ respuesta: 'Ok', mensaje: respuesta })
    } catch (error) {
        res.status(400).send({ respuesta: 'Carrito no encontrado', mensaje: error })
    }
})

export default cartRouter