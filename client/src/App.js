import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { StateProvider } from "./context/StateContext"

// Layout Components
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"

// Page Components
import Home from "./pages/Home"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import GoldMembership from "./pages/GoldMembership"
import Products from "./pages/Products"
import PrivateRoute from "./components/routing/PrivateRoute"

// CSS
import "./App.css"

function App() {
  return (
    <StateProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <Checkout />
                  </PrivateRoute>
                }
              />
              <Route path="/gold-membership" element={<GoldMembership />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </StateProvider>
  )
}

export default App
