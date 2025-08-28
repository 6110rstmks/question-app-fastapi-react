// components/PrivateRoute.tsx
import React from 'react'
import { Link } from "react-router"

interface PrivateRouteProps {
  isAuth: boolean
  children: React.ReactElement
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuth, children }) => {
    return isAuth ? children : <Link to="/login" />
}

export default PrivateRoute
