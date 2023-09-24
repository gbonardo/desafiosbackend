const socket = io()
const form = document.getElementById('idForm')

socket.on('dataProducts', (products) => {
    const tbody = document.querySelector("#tableProducts tbody")
    let table = ''
    if(products){
        products.forEach(product => {
            table += `
            <tr>
            <td>${product.id}</td>
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.price}</td>
            <td>${product.thumbnail}</td>
            <td>${product.code}</td>
            <td>${product.stock}</td>
            </tr>
            `
        });
    } else {
        console.log("No hay productos.")
    }
    tbody.innerHTML = table
})

socket.emit('realTimeProducts')