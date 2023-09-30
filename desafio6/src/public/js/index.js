const socket = io()

socket.emit('realTimeProducts')
/*
socket.on('welcome', (welcomeUser) => {
    if (welcomeUser != null && undefined) {
        document.getElementById("containerWelcome").innerHTML = `Bienvenido ${welcomeUser}`
        } else {
    }
})*/

socket.on('dataProducts', (products) => {
    const tbody = document.querySelector("#tableProducts tbody")
    let table = ''
    if (products) {
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

window.onload = async() =>{
    response = await fetch('/api/sessions/user')
    user = await response.json()
    document.getElementById("bienvenido").innerHTML = `Bienvenido ${user.first_name}`
    document.getElementById("email").innerHTML = `Email: ${user.email}`
    document.getElementById("age").innerHTML = `Edad: ${user.age}`
}