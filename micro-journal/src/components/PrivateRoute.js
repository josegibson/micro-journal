import { Navigate } from 'react-router-dom';
import { useUser } from '../providers/UserProvider';

const PrivateRoute = ({ children }) => {
  const { userId } = useUser();
  
  if (userId === 'default-user') {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute; 