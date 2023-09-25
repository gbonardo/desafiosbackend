const socket = io()
const form = document.getElementById('idForm')
const formDelete = document.getElementById('idFormDelete')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const datForm = new FormData(e.target)
    const newProduct = Object.fromEntries(datForm)
    socket.emit('addProduct', newProduct)
    socket.emit('realTimeProducts')
    e.target.reset()
})

socket.on('dataProducts', (products) => {
    const tbody = document.querySelector("#tableProducts tbody")
    let table = ''
    if(products){
        products.forEach(product => {
            table += `
            <tr>
            <td>${product._id}</td>
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
            <td>${product.category}</td>
            <td>${product.status}</td>
            <td>${product.code}</td>
            <td>${product.thumbnail}</td>
            
            </tr>
            `
        });
    } else {
        console.log("No hay productos.")
    }
    tbody.innerHTML = table
})

socket.emit('realTimeProducts')

formDelete.addEventListener('submit', (e) =>{
    e.preventDefault()
    const code = formDelete.elements["code"].value
    socket.emit('deleteProductCode', code)
    socket.emit('realTimeProducts')
    e.target.reset()
})


