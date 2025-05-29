// components/RoleBasedRoute.js
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleBasedRoute = ({ children, allowedRoles, pageKey }) => {
  const { user } = useSelector((state) => state.auth);

  console.log("user from auth", user)

  // Super admin gets full access
  if (user?.role === 'super-admin') return children;

  // Admin cannot access super-admin pages
  if (user?.role === 'admin' && allowedRoles.includes('super-admin')) {
    return <Navigate to="/access-denied" />;
  }

  // Teacher can only access assigned pages
  if (user?.role === 'teacher') {
    const allowedPages = user?.assignedPages || [];
    if (!allowedPages.includes(pageKey)) {
      return <Navigate to="/access-denied" />;
    }
  }

  return children;
};

export default RoleBasedRoute;
