import { Router } from "express";
import { deleteAndUpdateCartById, deleteCart, getCartById, postCart, postCartById } from "../controllers/cart.controllers.js";
import { purchaseCart } from "../controllers/orders.controllers.js";

const cartRouter = Router()

cartRouter.put('/', postCart)
cartRouter.get('/:cid', getCartById)
cartRouter.post('/:cid/products/:pid', postCartById)
cartRouter.delete('/:cid', deleteCart)
cartRouter.delete('/:cid/products/:pid', deleteAndUpdateCartById)

cartRouter.get('/:cid/purchase', purchaseCart)

export default cartRouter