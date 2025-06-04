import { Navigate } from "react-router-dom"
import { useStateContext } from "../../context/StateContext"

const PrivateRoute = ({ children }) => {
  const { state } = useStateContext()
  const { isAuthenticated, loading } = state

  if (loading) {
    return <div className="loading-spinner">Loading...</div>
  }

  return isAuthenticated ? children : <Navigate to="/login" />
}

export default PrivateRoute
