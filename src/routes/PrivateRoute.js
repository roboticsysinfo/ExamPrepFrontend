// components/PrivateRoute.js
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const PrivateRoute = ({ children }) => {
  const { isAuthenticated} = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth.user);

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" />;
  }

  return children;
};



export default PrivateRoute;
