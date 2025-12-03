import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Employee } from '../types';
import NameGameSetup from './NameGameSetup';
import NameGame from './NameGame';

type GameMode = 'face-to-name' | 'name-to-face';

const NameGamePage = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [gameMode, setGameMode] = useState<GameMode>('face-to-name');

  const handleStart = (employees: Employee[], mode: GameMode) => {
    setSelectedEmployees(employees);
    setGameMode(mode);
    setGameStarted(true);
  };

  const handleExit = () => {
    setGameStarted(false);
    setSelectedEmployees([]);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          padding: '20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          marginBottom: '20px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>Game Nhớ Tên Đồng Nghiệp</h1>
          <button
            className="btn btn-secondary"
            onClick={handleBackToHome}
            style={{ backgroundColor: 'white', color: '#4CAF50' }}
          >
            Về trang chủ
          </button>
        </div>
      </div>

      {/* Content */}
      {gameStarted ? (
        <NameGame
          employees={selectedEmployees}
          mode={gameMode}
          onExit={handleExit}
        />
      ) : (
        <NameGameSetup onStart={handleStart} />
      )}
    </div>
  );
};

export default NameGamePage;
