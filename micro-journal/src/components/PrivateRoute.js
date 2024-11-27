import { Navigate } from 'react-router-dom';
import { useApp } from '../providers/AppProvider';

const PrivateRoute = ({ children }) => {
  const { user } = useApp();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute; 