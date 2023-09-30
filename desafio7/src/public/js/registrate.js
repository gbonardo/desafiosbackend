const socket = io()
const form = document.getElementById('idFormRegistro')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const datForm = new FormData(e.target)
    const newUser = Object.fromEntries(datForm)
    //const correo = newUser.email
    socket.emit('addUser', newUser)
    socket.on('error', async (errorUser) => {
        if (errorUser) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El correo ya se esta utilizando.',
            })
        } else {
            e.target.reset()
            window.location.href = '/login'
            console.log("Usuario creado correctamente.")
            Swal.fire('Usuario registrado correctamente! Por favor inicie sesión.')
        }
    })

})