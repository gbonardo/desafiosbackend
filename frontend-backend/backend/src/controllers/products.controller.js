import { productModel } from "../dao/models/products.models.js"

/*export const getProducts = async (req, res) => {
    const { limit, page, filter, sort } = req.params

    const pag = page ? page : 1
    const lim = limit ? limit : 10
    const ord = sort == 'asc' ? 1 : 1

    try {
        const prods = await productModel.paginate({ filter: filter }, {
            limit: lim, page: pag, sort: { price: ord }
        })

        if (prods) {
            return res.status(200).send(products)
        }
        res.status(404).send({ error: "Productos no encontrados" })
    } catch (error) {
        res.status(500).send({ error: `Error en consultar productos ${error}` })

    }
}*/

export const getProducts = async (req, res) => {
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
}

/*export const getProduct = async (req, res) => {
    const { id } = req.params

    try {
        const prod = await productModel.findById(id)

        if (prod) {
            return res.status(200).send(product)
        }
        res.status(404).send({ error: "Producto no encontrados" })
    } catch (error) {
        res.status(500).send({ error: `Error en consultar producto ${error}` })

    }
}*/

//ESTE NOOO
/*export const getProduct = async (req, res) => {
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
}*/

export const getProductById = async (req, res) => {
    const { id } = req.params

    try {
        const prod = await productModel.findById(id)

        if (prod) {
            return res.status(200).send(prod)
        }
        res.status(404).send({ error: "Producto no encontrados" })
    } catch (error) {
        res.status(500).send({ error: `Error en consultar producto ${error}` })

    }
}

export const postProduct = async (req, res) => {
    const { title, description, code, price, stock, category } = req.body

    try {
        const prod = await productModel.create({ title, description, code, price, stock, category })

        if (prod) {
            return res.status(201).send(prod)
        }

        res.status(400).send({ error: "Error en crear producto" })

    } catch (error) {
        if (error.code == 11000) {
            return res.status(400).send({ error: "Producto ya creado con llave duplicada" })
        }
        res.status(500).send({ error: `Error en crear producto ${error}` })

    }
}

export const putProductById = async (req, res) => {
    const { id } = req.params
    const { title, description, code, price, stock, category } = req.body


    try {
        const prod = await productModel.findByIdAndUpdate(id, { title, description, code, price, stock, category })

        if (prod) {
            return res.status(200).send(product)
        }
        res.status(404).send({ error: "Producto no encontrados" })
    } catch (error) {
        res.status(500).send({ error: `Error en actualizar producto ${error}` })

    }
}

export const deleteProductById = async (req, res) => {
    const { id } = req.params

    try {
        const prod = await productModel.findByIdAndDelete(id)

        if (prod) {
            return res.status(200).send(product)
        }
        res.status(404).send({ error: "Producto no encontrados" })
    } catch (error) {
        res.status(500).send({ error: `Error en eliminar producto ${error}` })

    }
}