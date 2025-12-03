import { useState, useEffect } from 'react';
import PasswordPrompt from './PasswordPrompt';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Kiểm tra xem đã đăng nhập chưa (trong session)
    const authenticated = sessionStorage.getItem('authenticated');
    setIsAuthenticated(authenticated === 'true');
    setIsChecking(false);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  // Đang kiểm tra authentication
  if (isChecking) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}>
        <div>Đang kiểm tra...</div>
      </div>
    );
  }

  // Chưa đăng nhập - hiển thị form password
  if (!isAuthenticated) {
    return <PasswordPrompt onSuccess={handleAuthSuccess} />;
  }

  // Đã đăng nhập - hiển thị nội dung
  return <>{children}</>;
};

export default ProtectedRoute;
