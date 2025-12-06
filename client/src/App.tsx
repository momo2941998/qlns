import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import DepartmentDetailPage from './components/DepartmentDetailPage';
import NameGamePage from './components/NameGamePage';
import RankingPage from './components/RankingPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <h1>Hệ thống Quản lý Nhân sự</h1>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/departments/:id"
            element={
              <ProtectedRoute>
                <DepartmentDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="/name-game" element={<NameGamePage />} />
          <Route path="/ranking" element={<RankingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
