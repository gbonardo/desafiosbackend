

const socket = io()
const botonRegistro = document.getElementById('registrar')
const form = document.getElementById('idFormLogin')


form.addEventListener('submit', (e) => {
    e.preventDefault()
    const datForm = new FormData(e.target)
    //const newProduct = Object.fromEntries(datForm)
    //socket.emit('addProduct', newProduct)
   // socket.emit('realTimeProducts')
    e.target.reset()
})