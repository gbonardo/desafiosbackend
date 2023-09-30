import { Router } from "express";
import { productModel } from "../dao/models/products.models.js";

const productRouter = Router()

productRouter.get('/', async (req, res) => {
    const { limit, page, category, sort } = req.query

    try {
        let query = {}
        let link
        if (category) {
            query.category = category
            link = `&category=${query.category}`
        }
        let options = {
            limit: parseInt(limit) || 10,
            page: parseInt(page) || 1,
            sort: {
                price: sort || 1
            }
        }
        const products = await productModel.paginate(query, options)
        const respuesta = {
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `http://${req.headers.host}${req.baseUrl}?limit=${options.limit}&page=${products.prevPage}${link || ''}&sort=${options.sort.price}` : null,
            nextLink: products.hasNextPage ? `http://${req.headers.host}${req.baseUrl}?limit=${options.limit}&page=${products.nextPage}${link || ''}&sort=${options.sort.price}` : null
        }
        res.status(200).send({ respuesta: 'Ok', mensaje: respuesta })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consultar productos', mensaje: error })
    }
})

productRouter.get('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const prod = await productModel.findById(id)
        if (prod)
            res.status(200).send({ respuesta: 'Ok', mensaje: prod })
        else
            res.status(404).send({ respuesta: 'Error en consultar Producto', mensaje: 'No encontrado' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consulta producto', mensaje: error })
    }
})

productRouter.post('/', async (req, res) => {
    const { title, description, price, stock, category, code } = req.body
    try {
        const prod = await productModel.create({ title, description, stock, code, price, category })
        res.status(200).send({ respuesta: 'Ok', mensaje: prod })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en crear productos', mensaje: error })
    }
})

productRouter.put('/:id', async (req, res) => {
    const { id } = req.params
    const { title, description, price, stock, category, status, code } = req.body

    try {
        const prod = await productModel.findByIdAndUpdate(id, { title, description, stock, status, code, price, category })
        if (prod)
            res.status(200).send({ respuesta: 'OK', mensaje: 'Producto actualizado' })
        else
            res.status(404).send({ respuesta: 'Error en actualizar Producto', mensaje: 'No encontrado' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en actualizar producto', mensaje: error })
    }
})

productRouter.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const prod = await productModel.findByIdAndDelete(id)
        if (prod)
            res.status(200).send({ respuesta: 'Ok', mensaje: 'Producto eliminado' })
        else
            res.status(404).send({ respuesta: 'Error en eliminar Producto', mensaje: 'Not Found' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en eliminar producto', mensaje: error })
    }
})


export default productRouter