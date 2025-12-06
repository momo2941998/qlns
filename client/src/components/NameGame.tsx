import { useState, useEffect } from 'react';
import { Employee } from '../types';
import { getAvatarUrl } from '../utils/imageUrl';

interface NameGameProps {
  employees: Employee[];
  mode: 'face-to-name' | 'name-to-face';
  onExit: () => void;
}

interface Question {
  correctEmployee: Employee;
  options: Employee[];
}

// Fisher-Yates shuffle algorithm for better randomization
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const NameGame = ({ employees, mode, onExit }: NameGameProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  // Generate all questions at start
  useEffect(() => {
    // Group employees by gender
    const maleEmployees = employees.filter((emp) => emp.gioiTinh === 'Nam');
    const femaleEmployees = employees.filter((emp) => emp.gioiTinh === 'Nữ');

    // Determine which genders have enough people (at least 4)
    const validGenders: ('Nam' | 'Nữ')[] = [];
    if (maleEmployees.length >= 4) validGenders.push('Nam');
    if (femaleEmployees.length >= 4) validGenders.push('Nữ');

    // Filter employees to only include those from valid genders
    const validEmployees = employees.filter((emp) => validGenders.includes(emp.gioiTinh as 'Nam' | 'Nữ'));

    if (validEmployees.length === 0) {
      setQuestions([]);
      return;
    }

    const generatedQuestions: Question[] = [];
    const shuffledEmployees = shuffleArray(validEmployees);

    shuffledEmployees.forEach((correctEmp) => {
      // Get employees of the same gender as the correct answer
      const sameGenderEmployees = employees.filter(
        (emp) => emp.gioiTinh === correctEmp.gioiTinh && emp._id !== correctEmp._id
      );

      // Get 3 random wrong answers from same gender
      const wrongOptions = shuffleArray(sameGenderEmployees).slice(0, 3);

      // Combine and shuffle options
      const options = shuffleArray([correctEmp, ...wrongOptions]);

      generatedQuestions.push({
        correctEmployee: correctEmp,
        options,
      });
    });

    setQuestions(generatedQuestions);
  }, [employees]);

  // Update timer every second
  useEffect(() => {
    if (showResults) return; // Stop timer when game ends

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [showResults]);

  if (questions.length === 0) {
    // Check if it's because of insufficient employees
    const maleCount = employees.filter((emp) => emp.gioiTinh === 'Nam').length;
    const femaleCount = employees.filter((emp) => emp.gioiTinh === 'Nữ').length;

    if (maleCount < 4 && femaleCount < 4) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ color: '#f44336', marginBottom: '20px' }}>⚠️ Không đủ điều kiện</h2>
          <div style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
            Game yêu cầu tối thiểu <strong>4 nhân viên nam</strong> hoặc <strong>4 nhân viên nữ</strong> để chơi.
          </div>
          <div style={{ fontSize: '14px', color: '#999', marginBottom: '30px' }}>
            Hiện tại: {maleCount} nam, {femaleCount} nữ
          </div>
          <button className="btn btn-secondary" onClick={onExit}>
            Quay lại
          </button>
        </div>
      );
    }

    return <div style={{ textAlign: 'center', padding: '40px' }}>Đang chuẩn bị câu hỏi...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (empId: string) => {
    if (isAnswered) return;

    setSelectedAnswer(empId);
    setIsAnswered(true);

    if (empId === currentQuestion.correctEmployee._id) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setEndTime(Date.now());
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    const now = Date.now();
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
    setStartTime(now);
    setCurrentTime(now);
    setEndTime(null);
    // Re-shuffle questions
    setQuestions(shuffleArray(questions));
  };

  // Results screen
  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);

    // Calculate total time
    const totalTimeMs = endTime ? endTime - startTime : 0;
    const totalTimeSec = Math.round(totalTimeMs / 1000);
    const minutes = Math.floor(totalTimeSec / 60);
    const seconds = totalTimeSec % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Calculate average time per question
    const avgTimePerQuestion = totalTimeSec / questions.length;
    let speedRating = '';
    if (avgTimePerQuestion < 5) {
      speedRating = 'Rất nhanh! ⚡';
    } else if (avgTimePerQuestion < 10) {
      speedRating = 'Nhanh 🚀';
    } else if (avgTimePerQuestion < 15) {
      speedRating = 'Trung bình ⏱️';
    } else {
      speedRating = 'Chậm rãi 🐢';
    }

    return (
      <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2>Kết quả</h2>
        <div
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: percentage >= 80 ? '#4CAF50' : percentage >= 50 ? '#FF9800' : '#f44336',
            margin: '30px 0',
          }}
        >
          {percentage}%
        </div>
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>
          Đúng {score} / {questions.length} câu
        </div>
        <div style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
          {percentage >= 80 && 'Xuất sắc! Bạn nhớ tên rất tốt!'}
          {percentage >= 50 && percentage < 80 && 'Khá tốt! Cố gắng thêm nhé!'}
          {percentage < 50 && 'Cần luyện tập thêm!'}
        </div>

        {/* Time stats */}
        <div style={{
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ fontSize: '18px', marginBottom: '10px', color: '#666' }}>
            ⏱️ Thời gian hoàn thành
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
            {timeString}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Trung bình {avgTimePerQuestion.toFixed(1)}s/câu • {speedRating}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={handleRestart}>
            Chơi lại
          </button>
          <button className="btn btn-secondary" onClick={onExit}>
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Calculate elapsed time for display
  const elapsedMs = currentTime - startTime;
  const elapsedSec = Math.floor(elapsedMs / 1000);
  const displayMinutes = Math.floor(elapsedSec / 60);
  const displaySeconds = elapsedSec % 60;
  const elapsedTimeString = `${displayMinutes}:${displaySeconds.toString().padStart(2, '0')}`;

  // Game screen
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div>
          <strong>Câu hỏi: {currentQuestionIndex + 1} / {questions.length}</strong>
        </div>
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#666',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}>
          ⏱️ {elapsedTimeString}
        </div>
        <div>
          <strong>Điểm: {score}</strong>
        </div>
        <button className="btn btn-secondary" onClick={onExit}>
          Thoát
        </button>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          marginBottom: '30px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
            height: '100%',
            backgroundColor: '#4CAF50',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Question */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>
          {mode === 'face-to-name' ? 'Người này tên gì?' : 'Ai là người này?'}
        </h2>

        {mode === 'face-to-name' ? (
          // Show face, pick name
          <img
            src={getAvatarUrl(currentQuestion.correctEmployee.avatar)}
            alt="?"
            style={{
              width: '200px',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '50%',
              border: '4px solid #ddd',
            }}
          />
        ) : (
          // Show name, pick face
          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              padding: '40px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
            }}
          >
            {currentQuestion.correctEmployee.hoTen}
          </div>
        )}
      </div>

      {/* Options */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: mode === 'face-to-name' ? '1fr' : 'repeat(2, 1fr)',
          gap: '15px',
          marginBottom: '30px',
        }}
      >
        {currentQuestion.options.map((emp) => {
          const isSelected = selectedAnswer === emp._id;
          const isCorrect = emp._id === currentQuestion.correctEmployee._id;
          const showFeedback = isAnswered && (isSelected || isCorrect);

          let backgroundColor = 'white';
          let borderColor = '#ddd';
          if (showFeedback) {
            if (isCorrect) {
              backgroundColor = '#d4edda';
              borderColor = '#4CAF50';
            } else if (isSelected && !isCorrect) {
              backgroundColor = '#f8d7da';
              borderColor = '#f44336';
            }
          }

          return (
            <button
              key={emp._id}
              onClick={() => handleAnswer(emp._id)}
              disabled={isAnswered}
              style={{
                cursor: isAnswered ? 'default' : 'pointer',
                border: `3px solid ${borderColor}`,
                borderRadius: '8px',
                padding: '15px',
                backgroundColor,
                transition: 'all 0.2s ease',
                opacity: isAnswered && !showFeedback ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                justifyContent: mode === 'face-to-name' ? 'flex-start' : 'center',
              }}
            >
              {mode === 'name-to-face' && (
                <img
                  src={getAvatarUrl(emp.avatar)}
                  alt={emp.hoTen}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                  }}
                />
              )}
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: mode === 'face-to-name' ? 'normal' : 'bold',
                  textAlign: mode === 'face-to-name' ? 'left' : 'center',
                }}
              >
                {mode === 'face-to-name' ? emp.hoTen : ''}
              </div>
              {showFeedback && (
                <div style={{ marginLeft: 'auto', fontSize: '24px' }}>
                  {isCorrect ? '✓' : '✗'}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      {isAnswered && (
        <div style={{ textAlign: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            style={{ fontSize: '18px', padding: '12px 40px' }}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
          </button>
        </div>
      )}
    </div>
  );
};

export default NameGame;
