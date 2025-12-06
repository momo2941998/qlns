import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchEmployees } from '../features/employees/employeeSlice';
import { Employee } from '../types';
import { rankingAPI, RankingScore } from '../services/api';

interface RankingSetupProps {
  onStart: (employees: Employee[], mode: 'face-to-name' | 'name-to-face', playerName: string) => void;
}

const RankingSetup = ({ onStart }: RankingSetupProps) => {
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector((state) => state.employees);
  const [playerName, setPlayerName] = useState('');
  const [rankings, setRankings] = useState<RankingScore[]>([]);
  const [loadingRankings, setLoadingRankings] = useState(true);
  const [showNameModal, setShowNameModal] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'face-to-name' | 'name-to-face' | null>(null);
  const [selectedRankingMode, setSelectedRankingMode] = useState<'face-to-name' | 'name-to-face'>('face-to-name');

  useEffect(() => {
    dispatch(fetchEmployees());
    loadRankings();
  }, [dispatch, selectedRankingMode]);

  const loadRankings = async () => {
    try {
      setLoadingRankings(true);
      const response = await rankingAPI.getRankings({ mode: selectedRankingMode, limit: 20 });
      setRankings(response.data.data);
    } catch (error) {
      console.error('Error loading rankings:', error);
    } finally {
      setLoadingRankings(false);
    }
  };

  // Lọc employees có avatar
  const employeesWithAvatar = employees.filter((emp) => emp.avatar);

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

    setSelectedMode(mode);
    setShowNameModal(true);
  };

  const handleStartGame = () => {
    if (!playerName.trim()) {
      alert('Vui lòng nhập tên của bạn!');
      return;
    }

    if (!selectedMode) return;

    setShowNameModal(false);
    onStart(employeesWithAvatar, selectedMode, playerName.trim());
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
        {/* Left Column - Setup */}
        <div>
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

          {/* Mode Selection */}
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
              <li>Chọn chế độ chơi phù hợp với bạn</li>
              <li>Chơi với TẤT CẢ nhân viên có ảnh đại diện</li>
              <li>Mỗi câu hỏi có 4 lựa chọn cùng giới tính</li>
              <li>Kết quả sẽ được lưu vào bảng xếp hạng!</li>
            </ul>
          </div>
        </div>

        {/* Right Column - Rankings */}
        <div>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              position: 'sticky',
              top: '20px',
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>🏆 Bảng xếp hạng</h3>
                <button
                  onClick={loadRankings}
                  style={{
                    padding: '5px 10px',
                    fontSize: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    backgroundColor: 'white',
                  }}
                >
                  🔄 Làm mới
                </button>
              </div>

              {/* Mode Tabs */}
              <div style={{ display: 'flex', gap: '5px', borderBottom: '2px solid #f0f0f0' }}>
                <button
                  onClick={() => setSelectedRankingMode('face-to-name')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '13px',
                    border: 'none',
                    borderBottom: selectedRankingMode === 'face-to-name' ? '2px solid #4CAF50' : '2px solid transparent',
                    backgroundColor: selectedRankingMode === 'face-to-name' ? '#f0f8ff' : 'transparent',
                    cursor: 'pointer',
                    fontWeight: selectedRankingMode === 'face-to-name' ? 'bold' : 'normal',
                    color: selectedRankingMode === 'face-to-name' ? '#4CAF50' : '#666',
                    transition: 'all 0.2s',
                  }}
                >
                  📸 Ảnh→Tên
                </button>
                <button
                  onClick={() => setSelectedRankingMode('name-to-face')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '13px',
                    border: 'none',
                    borderBottom: selectedRankingMode === 'name-to-face' ? '2px solid #2196F3' : '2px solid transparent',
                    backgroundColor: selectedRankingMode === 'name-to-face' ? '#f0f8ff' : 'transparent',
                    cursor: 'pointer',
                    fontWeight: selectedRankingMode === 'name-to-face' ? 'bold' : 'normal',
                    color: selectedRankingMode === 'name-to-face' ? '#2196F3' : '#666',
                    transition: 'all 0.2s',
                  }}
                >
                  👤 Tên→Ảnh
                </button>
              </div>
            </div>

            {loadingRankings ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                Đang tải...
              </div>
            ) : rankings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎯</div>
                <div>Chưa có ai chơi!</div>
                <div style={{ fontSize: '13px', marginTop: '5px' }}>
                  Hãy là người đầu tiên!
                </div>
              </div>
            ) : (
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {rankings.map((ranking, index) => (
                  <div
                    key={ranking._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '12px',
                      borderBottom: '1px solid #f0f0f0',
                      backgroundColor: index < 3 ? '#fffbf0' : 'transparent',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        minWidth: '30px',
                        color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#999',
                      }}
                    >
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '3px' }}>
                        {ranking.playerName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {ranking.score}/{ranking.totalQuestions} • {formatTime(ranking.timeInSeconds)}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: ranking.percentage >= 80 ? '#4CAF50' : ranking.percentage >= 50 ? '#FF9800' : '#f44336',
                      }}
                    >
                      {ranking.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Name Input Modal */}
      {showNameModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowNameModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '40px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>
              🎮 Chuẩn bị bắt đầu!
            </h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
              Chế độ: <strong>{selectedMode === 'face-to-name' ? '📸 Ảnh → Tên' : '👤 Tên → Ảnh'}</strong>
            </p>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>
                👤 Nhập tên của bạn:
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleStartGame();
                  }
                }}
                placeholder="Ví dụ: Nguyễn Văn A"
                maxLength={50}
                autoFocus
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '16px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#ddd';
                }}
              />
              <div style={{ fontSize: '13px', color: '#999', marginTop: '8px' }}>
                Tên của bạn sẽ hiển thị trên bảng xếp hạng
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowNameModal(false)}
                style={{
                  flex: 1,
                  padding: '15px',
                  fontSize: '16px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleStartGame}
                style={{
                  flex: 1,
                  padding: '15px',
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                🚀 Sẵn sàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingSetup;
