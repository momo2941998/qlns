import { useState } from 'react';
import { hashPassword } from '../utils/passwordHash';

interface PasswordPromptProps {
  onSuccess: () => void;
}

const PasswordPrompt = ({ onSuccess }: PasswordPromptProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);

    try {
      // Hash password người dùng nhập
      const hashedInput = await hashPassword(password);

      // Lấy hash đã lưu từ env
      const correctPasswordHash = import.meta.env.VITE_CLIENT_PASSWORD;

      if (hashedInput === correctPasswordHash) {
        // Lưu vào sessionStorage để giữ đăng nhập trong session
        sessionStorage.setItem('authenticated', 'true');
        onSuccess();
      } else {
        setError('Mật khẩu không chính xác');
        setPassword('');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi xác thực');
      setPassword('');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        maxWidth: '400px',
        width: '90%',
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '10px', textAlign: 'center' }}>
          🔒 Truy cập bị hạn chế
        </h2>
        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '30px',
          fontSize: '14px'
        }}>
          Vui lòng nhập mật khẩu để tiếp tục
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="Nhập mật khẩu"
            autoFocus
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '16px',
              border: error ? '2px solid #f44336' : '2px solid #ddd',
              borderRadius: '8px',
              marginBottom: '10px',
              boxSizing: 'border-box',
            }}
          />

          {error && (
            <div style={{
              color: '#f44336',
              fontSize: '14px',
              marginBottom: '15px',
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isChecking}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: 'white',
              background: isChecking
                ? '#ccc'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              cursor: isChecking ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => !isChecking && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {isChecking ? 'Đang kiểm tra...' : 'Đăng nhập'}
          </button>
        </form>

        <p style={{
          marginTop: '20px',
          marginBottom: 0,
          fontSize: '12px',
          color: '#999',
          textAlign: 'center',
        }}>
          Liên hệ quản trị viên nếu bạn cần truy cập
        </p>
      </div>
    </div>
  );
};

export default PasswordPrompt;
