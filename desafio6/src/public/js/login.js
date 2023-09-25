const socket = io()
//const botonRegistro = document.getElementById('registrar')
const form = document.getElementById('idFormLogin')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const datForm = new FormData(e.target)
    const userLogin = Object.fromEntries(datForm)
    socket.emit('login', userLogin)
    socket.on('loginStatus', async (loginCorrect) => {
        if(loginCorrect){
            window.location.href = '/static'
            e.target.reset()
            console.log("Usuario logeado correctamente.")
            
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Corrobore los datos ingresados.',
            })
            console.log("Corrobore los datos ingresados.")
        }
    })
    e.target.reset()

})