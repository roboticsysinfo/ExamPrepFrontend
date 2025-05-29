// components/PrivateRoute.js
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const PrivateRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" />;
  }

  return children;
};



export default PrivateRoute;
