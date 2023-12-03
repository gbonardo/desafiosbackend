import { cartModel } from "../dao/models/carts.models.js"
import { productModel } from "../dao/models/products.models.js"

export const postCart = async (req,res)=>{
    try {
        const cart = await cartModel.create({});
    
        if (cart) {
            res.status(200).send({ respuesta: 'Carrito Creado', mensaje: cart });
        } else {
            res.status(404).send({ respuesta: 'Error al crear Carrito', mensaje: 'Cart Not Found' });
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'Error al crear Carrito', mensaje: error });
    }
}

export const getCartById = async (req, res) => {
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
}

export const postCartById = async (req, res) => {
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
}

export const deleteCart = async (req, res) => {
    const { cid } = req.params
    try {
        await cartModel.findByIdAndUpdate(cid, { products: [] })
        res.status(200).send({ respuesta: 'Ok', mensaje: 'Carrito vacio' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Carrito no encontrado', mensaje: error })
    }
}

export const deleteAndUpdateCartById = async (req, res) => {
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
}