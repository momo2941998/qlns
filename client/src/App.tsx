import DepartmentList from './components/DepartmentList';
import EmployeeList from './components/EmployeeList';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Hệ thống Quản lý Nhân sự</h1>
      <DepartmentList />
      <EmployeeList />
    </div>
  );
}

export default App;
