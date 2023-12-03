import {Router} from "express";
import ProductManager from "./ProductManager.js" 

const productManager = new ProductManager()
const prodsRouter = Router()

prodsRouter.get('/', async (req,res) => {
    const {limit} = req.query
    const prods = await productManager.getProducts()
    const products = prods.slice(0, limit)
    res.status(200).send(products)
})
prodsRouter.get('/:id', async (req,res) => {
    const { id } = req.params
    const prod = await productManager.getProductById(parseInt(id))
    if(prod) {
        res.status(200).send(prod)
    } else {
        res.status(404).send("Producto no encontrado.")
    }
})
prodsRouter.post('/', async (req,res) => {
    
    const productos = await productManager.getProducts()
    const producto = productos.find(prod => prod.code === req.body.code)
    if(producto){
        res.status(400).send("Producto ya existente") 
    } else {
        await productManager.addProduct(req.body)
        res.status(200).send("Producto creado")
    }
    
})
prodsRouter.put('/:id', async (req,res) => {
    const { id }= req.params
    const {title, description, price, thumbnail, code, stock} = req.body
    const product = {title, description, price, thumbnail, code, stock}
    if(id != -1){
        await productManager.updateProduct(parseInt(id), product)
        res.status(200).send(`Producto ${product.title} actualizado`)
    } else {
        res.status(404).send("Producto no encontrado")
    }
    
})

prodsRouter.delete('/:id', async (req,res) => {
    const { id } = req.params
    if(id != -1){
        await productManager.deleteProduct(parseInt(id))
        res.status(200).send(`Producto eliminado`)
    } else {
        res.status(404).send("Producto no encontrado")
    }
})

export default prodsRouter