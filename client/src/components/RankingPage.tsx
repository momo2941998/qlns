import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Employee } from '../types';
import RankingSetup from './RankingSetup';
import NameGame from './NameGame';

type GameMode = 'face-to-name' | 'name-to-face';

const RankingPage = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [gameMode, setGameMode] = useState<GameMode>('face-to-name');
  const [playerName, setPlayerName] = useState('');

  const handleStart = (employees: Employee[], mode: GameMode, name: string) => {
    setSelectedEmployees(employees);
    setGameMode(mode);
    setPlayerName(name);
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          marginBottom: '20px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, marginBottom: '5px' }}>🏆 Ranking - Thách thức nhớ tên</h1>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              Chơi với tất cả nhân viên và ghi danh vào bảng xếp hạng!
            </div>
          </div>
          <button
            className="btn btn-secondary"
            onClick={handleBackToHome}
            style={{ backgroundColor: 'white', color: '#667eea' }}
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
          playerName={playerName}
          gameType="ranking"
        />
      ) : (
        <RankingSetup onStart={handleStart} />
      )}
    </div>
  );
};

export default RankingPage;
