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

const NameGame = ({ employees, mode, onExit }: NameGameProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Generate all questions at start
  useEffect(() => {
    const generatedQuestions: Question[] = [];
    const shuffledEmployees = [...employees].sort(() => Math.random() - 0.5);

    shuffledEmployees.forEach((correctEmp) => {
      // Get 3 random wrong answers
      const wrongOptions = employees
        .filter((emp) => emp._id !== correctEmp._id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      // Combine and shuffle options
      const options = [correctEmp, ...wrongOptions].sort(() => Math.random() - 0.5);

      generatedQuestions.push({
        correctEmployee: correctEmp,
        options,
      });
    });

    setQuestions(generatedQuestions);
  }, [employees]);

  if (questions.length === 0) {
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
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
    // Re-shuffle questions
    setQuestions([...questions].sort(() => Math.random() - 0.5));
  };

  // Results screen
  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
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
        <div style={{ fontSize: '16px', color: '#666', marginBottom: '40px' }}>
          {percentage >= 80 && 'Xuất sắc! Bạn nhớ tên rất tốt!'}
          {percentage >= 50 && percentage < 80 && 'Khá tốt! Cố gắng thêm nhé!'}
          {percentage < 50 && 'Cần luyện tập thêm!'}
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
        }}
      >
        <div>
          <strong>Câu hỏi: {currentQuestionIndex + 1} / {questions.length}</strong>
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
