import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Register } from './components/Register.jsx'
import { Login } from './components/Login.jsx'
import { Products } from './components/Products.jsx'
import { NewProducts } from './components/NewProducts.jsx'

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/register' element={<Register />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/products' element={<Products />}/>
          <Route path='/new-product' element={<NewProducts />}/>
        </Routes>
      </BrowserRouter>
    </>
    )
}