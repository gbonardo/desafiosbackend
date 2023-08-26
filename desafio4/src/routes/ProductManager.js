import { promises as fs } from 'fs'

const pathData = 'src/data/products.json'

class ProductManager {
    constructor() {
    }
    async addProduct(product) {
        const products = JSON.parse(await fs.readFile(pathData, 'utf-8'))
        const prod = products.find(prod => prod.id === product.id)
        if (prod) {
            console.log("El producto existe.")
        } else {
            products.push(product)
            await fs.writeFile(pathData, JSON.stringify(products))
        }
    }
    async getProducts() {
        const products = JSON.parse(await fs.readFile(pathData, 'utf-8'))
        return products
    }
    async getProductById(id) {
        const products = JSON.parse(await fs.readFile(pathData, 'utf-8'))
        const prod = products.find(prod => prod.id === id)
        if (prod) {
            return prod
        } else {
            console.log("El producto no existe.")
        }
    }
    async getProductByCode(code) {
        const products = JSON.parse(await fs.readFile(pathData, 'utf-8'))
        const prod = products.findIndex(prod => prod.code === code)
        if (prod) {
            return prod
        } else {
            console.log("El producto no existe.")
        }
    }
    async updateProduct(id, product) {
        const products = JSON.parse(await fs.readFile(pathData, 'utf-8'))
        const indice = products.findIndex(prod => prod.id === id)
        if(indice != -1){
            products[indice].title = product.title
            products[indice].description = product.description
            products[indice].price = product.price
            products[indice].thumbnail = product.thumbnail
            products[indice].code = product.code
            products[indice].stock = product.stock
            await fs.writeFile(pathData, JSON.stringify(products))
        } else {
            console.log("Producto no encontrado.")
        }
    }
    async deleteProduct(id) {
        const products = JSON.parse(await fs.readFile(pathData, 'utf-8'))
        const prod = products.find(prod => prod.id === id)
        if(prod){
            await fs.writeFile(pathData, JSON.stringify(products.filter(prod => prod.id != id)))
        } else {
            console.log("Producto no encontrado.")
        }
    }
}
class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.id = Product.incrementarId()
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
    }
    static incrementarId() {
        if (this.idIncrementar) {
            this.idIncrementar++
        } else {
            this.idIncrementar = 1
        }
        return this.idIncrementar
    }
}

export default ProductManager;




