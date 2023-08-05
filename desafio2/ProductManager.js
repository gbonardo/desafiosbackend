import { promises as fs } from 'fs'

const path = './products.json'

class ProductManager {
    constructor() {
    }

    async addProduct(product) {
        const products = JSON.parse(await fs.readFile(path, 'utf-8'))
        const prod = products.find(prod => prod.id === product.id)
        if (prod) {
            console.log("El producto existe.")
        } else {
            products.push(product)
            await fs.writeFile(path, JSON.stringify(products))
        }
    }

    async getProducts() {
        const products = JSON.parse(await fs.readFile(path, 'utf-8'))
        console.log(products)
    }

    async getProductsByid(id) {
        const products = JSON.parse(await fs.readFile(path, 'utf-8'))
        const prod = products.find(prod => prod.id === id)
        if (prod) {
            console.log(prod)
        } else {
            console.log("El producto no existe.")
        }
    }

    async updateProduct(id, product) {
        const products = JSON.parse(await fs.readFile(path, 'utf-8'))
        const indice = products.findIndex(prod => prod.id === id)

        if(indice != -1){
            products[indice].title = product.title
            products[indice].description = product.description
            products[indice].price = product.price
            products[indice].thumbnail = product.thumbnail
            products[indice].code = product.code
            products[indice].stock = product.stock
            await fs.writeFile(path, JSON.stringify(products))
        } else {
            console.log("Producto no encontrado.")
        }
    }

    async deleteProduct(id) {
        const products = JSON.parse(await fs.readFile(path, 'utf-8'))
        const prod = products.find(prod => prod.id === id)

        if(prod){
            await fs.writeFile(path, JSON.stringify(products.filter(prod => prod.id != id)))
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


const producto1 = new Product("Mouse Logitech", "Modelo M170 Color Negro", "6000", [], "A001INFOPERI", "30")
const producto2 = new Product("Mouse Genius", "Modelo DX-120 Color Negro", "3000", [], "A001INFOPERI", "15")
const producto3 = new Product("Teclado Logitech", "Modelo K380 Color Negro", "10000", [], "A002INFOPERI", "20")
const producto4 = new Product("Teclado Genius", "Modelo Slimstar Q200 Color Negro", "6000", [], "A002INFOPERI", "25")
const producto5 = new Product("Monitor Dell", "Modelo P2433G Color Negro y Plateado", "300000", [], "A003INFOPERI", "20")
const producto6 = new Product("Notebook Dell", "Modelo Inspiron Color Negro", "500000", [], "A001INFONOTE", "10")


const productManager = new ProductManager()


//productManager.addProduct(producto1)
//productManager.addProduct(producto2)
//productManager.addProduct(producto3)
//productManager.addProduct(producto4)
//productManager.addProduct(producto5)
//productManager.addProduct(producto6)

//productManager.getProductsByid()
//productManager.getProducts()
//productManager.updateProduct(1, {title: "Mouse Logitech1"})
productManager.deleteProduct(6)

