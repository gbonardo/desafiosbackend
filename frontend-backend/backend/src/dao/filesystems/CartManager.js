import { promises as fs } from 'fs'

const pathCart = 'src/data/carts.json'

class CartManager {
    constructor() {
    }
    async addCart(cart) {
        const carts = JSON.parse(await fs.readFile(pathCart, 'utf-8'))
        const carrito = carts.find(carrit => carrit.cid === cart.cid)
        if (carrito) {
            console.log("El carrito existe.")
        } else {
            carts.push(cart)
            await fs.writeFile(pathCart, JSON.stringify(carts))
        }
    }
    async getCarts() {
        const carts = JSON.parse(await fs.readFile(pathCart, 'utf-8'))
        return carts
    }
    async getCartById(cid) {
        const carritos = JSON.parse(await fs.readFile(pathCart, 'utf-8'))
        const carrito = carritos.find(cart => cart.cid === cid)
        if (carrito) {
            return carrito
        } else {
            console.log("El carrito no existe.")
        }
    }
    async updateCart(cid, products) {
        const carts = JSON.parse(await fs.readFile(pathCart, 'utf-8'))
        const indice = carts.findIndex(cart => cart.cid === cid)
        if (indice != -1) {
            carts[indice].products.quantity = products.quantity
            await fs.writeFile(pathCart, JSON.stringify(carts))
        } else {
            console.log("Carrito no encontrado.")
        }
    }
}

class Cart {
    constructor(products) {
        this.cid = Cart.incrementarId()
        this.products = products
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

export default CartManager;




