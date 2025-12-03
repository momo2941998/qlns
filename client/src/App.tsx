import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import DepartmentDetailPage from './components/DepartmentDetailPage';
import NameGamePage from './components/NameGamePage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <h1>Hệ thống Quản lý Nhân sự</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/departments/:id" element={<DepartmentDetailPage />} />
          <Route path="/name-game" element={<NameGamePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
