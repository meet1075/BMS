import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext.jsx';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const { user } = useContext(UserContext);
    if (!user) {
        return <Navigate to="/" replace />;
    }
  return children;
}

const AdminProtectedRoute = ({children}) => {
    const { user } = useContext(UserContext);
    if (!user) {
        return <Navigate to="/" replace />;
    }
    if (user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
}

export { ProtectedRoute, AdminProtectedRoute };
export default ProtectedRoute;
