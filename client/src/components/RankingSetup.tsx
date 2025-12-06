import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchEmployees } from '../features/employees/employeeSlice';
import { Employee } from '../types';

interface RankingSetupProps {
  onStart: (employees: Employee[], mode: 'face-to-name' | 'name-to-face') => void;
}

const RankingSetup = ({ onStart }: RankingSetupProps) => {
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Lọc employees có avatar
  const employeesWithAvatar = employees.filter((emp) => emp.avatar);
  console.log(employeesWithAvatar, "__employeesWithAvatar");

  // Kiểm tra đủ điều kiện
  const maleCount = employeesWithAvatar.filter((emp) => emp.gioiTinh === 'Nam').length;
  const femaleCount = employeesWithAvatar.filter((emp) => emp.gioiTinh === 'Nữ').length;
  const hasEnoughMale = maleCount >= 4;
  const hasEnoughFemale = femaleCount >= 4;
  const isValid = hasEnoughMale || hasEnoughFemale;

  const handleModeSelect = (mode: 'face-to-name' | 'name-to-face') => {
    if (!isValid) {
      alert(
        `Không đủ điều kiện để chơi Ranking!\n\n` +
        `Cần ít nhất 4 nam HOẶC 4 nữ.\n\n` +
        `Hiện tại: ${maleCount} nam, ${femaleCount} nữ`
      );
      return;
    }
    onStart(employeesWithAvatar, mode);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '15px' }}>🏆 Chế độ Ranking</h2>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>
          Thách thức bản thân với tất cả {employeesWithAvatar.length} nhân viên!
        </p>
        <div style={{ fontSize: '14px', color: '#999' }}>
          ({maleCount} nam, {femaleCount} nữ)
        </div>
      </div>

      {!isValid && (
        <div
          style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '18px', color: '#856404', marginBottom: '10px' }}>
            ⚠️ Không đủ điều kiện
          </div>
          <div style={{ fontSize: '14px', color: '#856404' }}>
            Cần ít nhất 4 nam HOẶC 4 nữ để chơi Ranking
          </div>
        </div>
      )}

      <div
        style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '30px',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center' }}>
          Chọn chế độ chơi:
        </h3>

        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Face to Name */}
          <button
            onClick={() => handleModeSelect('face-to-name')}
            disabled={!isValid}
            style={{
              padding: '30px',
              border: '2px solid #4CAF50',
              borderRadius: '12px',
              backgroundColor: isValid ? 'white' : '#f5f5f5',
              cursor: isValid ? 'pointer' : 'not-allowed',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              opacity: isValid ? 1 : 0.5,
            }}
            onMouseEnter={(e) => {
              if (isValid) {
                e.currentTarget.style.backgroundColor = '#f0f8ff';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (isValid) {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>📸 Ảnh → Tên</div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Nhìn ảnh, chọn đúng tên người
            </div>
          </button>

          {/* Name to Face */}
          <button
            onClick={() => handleModeSelect('name-to-face')}
            disabled={!isValid}
            style={{
              padding: '30px',
              border: '2px solid #2196F3',
              borderRadius: '12px',
              backgroundColor: isValid ? 'white' : '#f5f5f5',
              cursor: isValid ? 'pointer' : 'not-allowed',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              opacity: isValid ? 1 : 0.5,
            }}
            onMouseEnter={(e) => {
              if (isValid) {
                e.currentTarget.style.backgroundColor = '#f0f8ff';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (isValid) {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>👤 Tên → Ảnh</div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Đọc tên, chọn đúng ảnh người
            </div>
          </button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          padding: '20px',
          fontSize: '14px',
          color: '#1976d2',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>💡 Lưu ý:</div>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Bạn sẽ chơi với TẤT CẢ nhân viên có ảnh đại diện</li>
          <li>Mỗi câu hỏi có 4 lựa chọn cùng giới tính</li>
          <li>Thời gian và điểm số sẽ được ghi nhận</li>
          <li>Cố gắng đạt điểm cao nhất!</li>
        </ul>
      </div>
    </div>
  );
};

export default RankingSetup;
