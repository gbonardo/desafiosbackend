import express from 'express'
import ProductManager from './ProductManager.js'

const PORT = 4000

const productManager= new ProductManager()

const app = express()

app.get('/products', async (req, res) => {
    const prods = await productManager.getProducts()
    const {limit} = req.query
    
    if(limit){
      const products = prods.slice(0,limit)
      res.send(products)
    } else {

    }
    res.send(prods)
})

app.get('/products/:id', async (req,res) => {
    const {id} = req.params
    const product = await productManager.getProductById(parseInt(id))
    if(product){
        res.send(product)
    } else {
        res.send("Producto no existe.")
    } 
    
})

app.listen(PORT, () => {
    console.log(`Server on port ${4000}`)
})