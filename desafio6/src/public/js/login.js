const socket = io()

const form = document.getElementById('idFormLogin')

form.addEventListener('submit', async (e) =>{
    e.preventDefault()
    const datForm = new FormData(e.target)
    const login = Object.fromEntries(datForm)
    try {
        await fetch('/api/sessions/login', {
            method: 'POST',
            body: JSON.stringify(login),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            }
        })
        .then(response =>{
            if (response.ok)
            window.location.href = response.url
        })
        .catch(error=>{
            throw(error)
        })

    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un error al intentar iniciar sesión'
        })
    }
})


/*
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
            socket.emit('welcome', (welcomeUser))
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
*/

