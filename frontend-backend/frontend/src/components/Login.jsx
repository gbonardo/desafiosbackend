import { useRef } from "react"
import { useNavigate } from "react-router-dom"

export const Login = () => {

    const formRef = useRef(null)
    const navigate = useNavigate()

    const handleSumbit = async(e) => {
        e.preventDefault()
        //console.log(formRef.current)
        const datForm = new FormData(formRef.current)
        //console.log(datForm.get('password'))
        //console.log(datForm)
        const data = Object.fromEntries(datForm)
        //console.log(data)
        const response = await fetch('http://localhost:8080/api/sessions/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        //console.log(response)
        if(response.status == 200){
            const datos = await response.json()
            document.cookie = `jwtCookie=${datos.token}; expires${new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toUTCString()};path=/`
            navigate('/products')
        } else {
            console.log(response)
        }
    }

    return (
        <div className="container mb-3">
            <h2>Formulario de Login</h2>
            <form onSubmit={handleSumbit} ref={formRef}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" name="email" className="form-control"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" name="password" className="form-control"/>
                    </div>                 
                    
                    <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
            </form>

        </div>
    )
}