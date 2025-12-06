import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchEmployees } from '../features/employees/employeeSlice';
import { Employee } from '../types';
import { getAvatarUrl } from '../utils/imageUrl';

interface NameGameSetupProps {
  onStart: (employees: Employee[], mode: 'face-to-name' | 'name-to-face') => void;
}

const NameGameSetup = ({ onStart }: NameGameSetupProps) => {
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector((state) => state.employees);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [mode, setMode] = useState<'face-to-name' | 'name-to-face'>('face-to-name');

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Lọc employees có avatar
  const employeesWithAvatar = employees.filter((emp) => emp.avatar);

  const toggleSelect = (empId: string) => {
    if (selectedIds.includes(empId)) {
      setSelectedIds(selectedIds.filter((id) => id !== empId));
    } else {
      setSelectedIds([...selectedIds, empId]);
    }
  };

  const selectAll = () => {
    setSelectedIds(employeesWithAvatar.map((emp) => emp._id));
  };

  const deselectAll = () => {
    setSelectedIds([]);
  };

  const handleStart = () => {
    const selectedEmployees = employees.filter((emp) =>
      selectedIds.includes(emp._id)
    );
    if (selectedEmployees.length < 4) {
      alert('Vui lòng chọn ít nhất 4 người để chơi game!');
      return;
    }

    // Check gender requirements
    const maleCount = selectedEmployees.filter((emp) => emp.gioiTinh === 'Nam').length;
    const femaleCount = selectedEmployees.filter((emp) => emp.gioiTinh === 'Nữ').length;

    if (maleCount < 4 && femaleCount < 4) {
      alert(
        `Cần ít nhất 4 nam HOẶC 4 nữ để chơi!\n\n` +
        `Hiện tại bạn đã chọn: ${maleCount} nam, ${femaleCount} nữ\n\n` +
        `Vui lòng chọn thêm để đủ điều kiện.`
      );
      return;
    }

    onStart(selectedEmployees, mode);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Chọn người để học tên</h2>

      {/* Mode selection */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>Chế độ chơi:</h3>
        <div style={{ display: 'flex', gap: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="radio"
              value="face-to-name"
              checked={mode === 'face-to-name'}
              onChange={(e) => setMode(e.target.value as any)}
              style={{ marginRight: '8px' }}
            />
            <div>
              <strong>Ảnh → Tên</strong>
              <div style={{ fontSize: '13px', color: '#666' }}>
                Nhìn ảnh, chọn đúng tên
              </div>
            </div>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="radio"
              value="name-to-face"
              checked={mode === 'name-to-face'}
              onChange={(e) => setMode(e.target.value as any)}
              style={{ marginRight: '8px' }}
            />
            <div>
              <strong>Tên → Ảnh</strong>
              <div style={{ fontSize: '13px', color: '#666' }}>
                Đọc tên, chọn đúng ảnh
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Selection controls */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div>
            <strong>Đã chọn: {selectedIds.length} / {employeesWithAvatar.length} người</strong>
          </div>
          {(() => {
            const selectedEmployees = employees.filter((emp) => selectedIds.includes(emp._id));
            const maleCount = selectedEmployees.filter((emp) => emp.gioiTinh === 'Nam').length;
            const femaleCount = selectedEmployees.filter((emp) => emp.gioiTinh === 'Nữ').length;
            const hasEnoughMale = maleCount >= 4;
            const hasEnoughFemale = femaleCount >= 4;
            const isValid = hasEnoughMale || hasEnoughFemale;

            return (
              <div style={{ fontSize: '13px', marginTop: '5px' }}>
                <span style={{ color: '#666' }}>
                  ({maleCount} nam, {femaleCount} nữ)
                </span>
                {!isValid && (
                  <div style={{ color: '#f44336', marginTop: '3px' }}>
                    ⚠️ Cần ít nhất 4 nam HOẶC 4 nữ để chơi
                  </div>
                )}
                {isValid && (
                  <div style={{ color: '#4CAF50', marginTop: '3px' }}>
                    ✓ Đủ điều kiện để chơi
                  </div>
                )}
              </div>
            );
          })()}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={selectAll}>
            Chọn tất cả
          </button>
          <button className="btn btn-secondary" onClick={deselectAll}>
            Bỏ chọn tất cả
          </button>
        </div>
      </div>

      {/* Employee grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '15px',
          marginBottom: '20px',
        }}
      >
        {employeesWithAvatar.map((emp) => {
          const isSelected = selectedIds.includes(emp._id);
          return (
            <div
              key={emp._id}
              onClick={() => toggleSelect(emp._id)}
              style={{
                cursor: 'pointer',
                border: isSelected ? '3px solid #4CAF50' : '2px solid #ddd',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                backgroundColor: isSelected ? '#f0f8ff' : 'white',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 2px 8px rgba(76, 175, 80, 0.3)' : 'none',
              }}
            >
              <img
                src={getAvatarUrl(emp.avatar)}
                alt={emp.hoTen}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  marginBottom: '8px',
                }}
              />
              <div style={{ fontSize: '14px', fontWeight: isSelected ? 'bold' : 'normal' }}>
                {emp.hoTen}
              </div>
              {isSelected && (
                <div style={{ color: '#4CAF50', fontSize: '20px', marginTop: '5px' }}>
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      {employeesWithAvatar.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            color: '#999',
            border: '2px dashed #ddd',
            borderRadius: '8px',
          }}
        >
          Chưa có nhân viên nào có ảnh đại diện. Vui lòng thêm ảnh cho nhân viên trước!
        </div>
      )}

      {/* Start button */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button
          className="btn btn-primary"
          onClick={handleStart}
          disabled={(() => {
            const selectedEmployees = employees.filter((emp) => selectedIds.includes(emp._id));
            const maleCount = selectedEmployees.filter((emp) => emp.gioiTinh === 'Nam').length;
            const femaleCount = selectedEmployees.filter((emp) => emp.gioiTinh === 'Nữ').length;
            return maleCount < 4 && femaleCount < 4;
          })()}
          style={{
            fontSize: '18px',
            padding: '12px 40px',
          }}
        >
          Bắt đầu chơi
        </button>
      </div>
    </div>
  );
};

export default NameGameSetup;
