import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchEmployees, deleteEmployee } from '../features/employees/employeeSlice';
import { fetchDepartments } from '../features/departments/departmentSlice';
import { Employee } from '../types';
import { formatDateToYYYYMMDD } from '../utils/dateFormat';
import { getAvatarUrl } from '../utils/imageUrl';
import EmployeeForm from './EmployeeForm';
import ImportEmployee from './ImportEmployee';
import DepartmentList from './DepartmentList';

const Home = () => {
  const dispatch = useAppDispatch();
  const { employees, loading } = useAppSelector((state) => state.employees);
  const { departments } = useAppSelector((state) => state.departments);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchDepartments());
  }, [dispatch]);

  // Tìm kiếm và lọc nhân viên
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Tìm kiếm theo tên, email, sđt
      const matchesSearch =
        searchTerm === '' ||
        emp.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.sdt?.includes(searchTerm) ||
        emp.stt.toString().includes(searchTerm);

      // Lọc theo phòng ban
      const matchesDepartment =
        selectedDepartment === '' || emp.department?._id === selectedDepartment;

      // Lọc theo giới tính
      const matchesGender = selectedGender === '' || emp.gioiTinh === selectedGender;

      return matchesSearch && matchesDepartment && matchesGender;
    });
  }, [employees, searchTerm, selectedDepartment, selectedGender]);

  // Thống kê
  const stats = useMemo(() => {
    return {
      total: employees.length,
      male: employees.filter((e) => e.gioiTinh === 'Nam').length,
      female: employees.filter((e) => e.gioiTinh === 'Nữ').length,
      departments: departments.length,
    };
  }, [employees, departments]);

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên "${name}"?`)) {
      await dispatch(deleteEmployee(id));
      dispatch(fetchEmployees());
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEmployee(undefined);
    dispatch(fetchEmployees());
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedGender('');
  };

  return (
    <div className="home-container">
      {/* Header với thống kê */}
      <div className="home-header">
        <h1>Quản lý Nhân sự</h1>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Tổng nhân viên</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👨</div>
            <div className="stat-content">
              <div className="stat-value">{stats.male}</div>
              <div className="stat-label">Nam</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👩</div>
            <div className="stat-content">
              <div className="stat-value">{stats.female}</div>
              <div className="stat-label">Nữ</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏢</div>
            <div className="stat-content">
              <div className="stat-value">{stats.departments}</div>
              <div className="stat-label">Phòng ban</div>
            </div>
          </div>
          <Link to="/name-game" className="stat-card stat-card-game">
            <div className="stat-icon">🎮</div>
            <div className="stat-content">
              <div className="stat-label" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                Game Nhớ Tên
              </div>
              <div style={{ fontSize: '13px', marginTop: '5px', opacity: 0.9 }}>
                Học tên đồng nghiệp
              </div>
            </div>
          </Link>
          <Link to="/ranking" className="stat-card stat-card-ranking">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-label" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                Ranking
              </div>
              <div style={{ fontSize: '13px', marginTop: '5px', opacity: 0.9 }}>
                Thách thức toàn bộ
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Danh sách phòng ban */}
      <div className="department-section">
        <DepartmentList />
      </div>



      {/* Action buttons - Import và Thêm */}
      <div>
        <div>
          <ImportEmployee />
          <button
            onClick={() => {
              setEditingEmployee(undefined);
              setShowForm(true);
            }}
            className="btn btn-primary"
          >
            ➕ Thêm nhân viên
          </button>
        </div>
      </div>
      {/* Thanh tìm kiếm và lọc */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo tên, email, SĐT, STT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-row">
          <div className="filters">
            <label className="filter-label">Lọc theo:</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="filter-select"
            >
              <option value="">Tất cả phòng ban</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.ten}
                </option>
              ))}
            </select>

            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="filter-select"
            >
              <option value="">Tất cả giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>

            {(searchTerm || selectedDepartment || selectedGender) && (
              <button onClick={handleClearFilters} className="btn btn-secondary btn-clear">
                ✕ Xóa bộ lọc
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Kết quả tìm kiếm */}
      <div className="results-section">
        <div className="results-header">
          <h2>
            Kết quả: {filteredEmployees.length} nhân viên
            {(searchTerm || selectedDepartment || selectedGender) && (
              <span className="filter-badge"> (Đã lọc)</span>
            )}
          </h2>
        </div>

        {loading ? (
          <div className="loading">Đang tải dữ liệu...</div>
        ) : filteredEmployees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Không tìm thấy nhân viên</h3>
            <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Avatar</th>
                  <th>Họ tên</th>
                  <th>Giới tính</th>
                  <th>Ngày sinh</th>
                  <th>Phòng ban</th>
                  <th>Email</th>
                  <th>SĐT</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp._id}>
                    <td>{emp.stt}</td>
                    <td>
                      {emp.avatar ? (
                        <img
                          src={getAvatarUrl(emp.avatar)}
                          alt={emp.hoTen}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1px solid #ddd',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#e0e0e0',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            color: '#666',
                          }}
                        >
                          {emp.hoTen.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td><strong>{emp.hoTen}</strong></td>
                    <td>{emp.gioiTinh}</td>
                    <td>{formatDateToYYYYMMDD(emp.ngaySinh)}</td>
                    <td>
                      <span className="badge">{emp.department?.ten || 'N/A'}</span>
                    </td>
                    <td>{emp.email}</td>
                    <td>{emp.sdt}</td>
                    <td>
                      <div className="action-buttons-inline">
                        <button
                          className="btn btn-sm btn-edit"
                          onClick={() => handleEdit(emp)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-sm btn-delete"
                          onClick={() => handleDelete(emp._id, emp.hoTen)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form thêm/sửa nhân viên */}
      {showForm && <EmployeeForm employee={editingEmployee} onClose={handleCloseForm} />}

      <style>{`
        .home-container {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .home-header {
          margin-bottom: 30px;
        }

        .department-section {
          margin-bottom: 30px;
        }

        .home-header h1 {
          margin-bottom: 20px;
          color: #333;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 15px;
          color: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .stat-card:nth-child(2) {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .stat-card:nth-child(3) {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .stat-card:nth-child(4) {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }

        .stat-card-game {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .stat-card-game:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .stat-card-ranking {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .stat-card-ranking:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .stat-icon {
          font-size: 40px;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 14px;
          opacity: 0.9;
        }

        .search-filter-section {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 15px;
        }

        .search-box {
          margin-bottom: 20px;
        }

        .search-input {
          width: 100%;
          padding: 14px 20px;
          font-size: 16px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          transition: all 0.3s;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .filters-row {
          border-top: 1px solid #f0f0f0;
          padding-top: 15px;
        }

        .filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }

        .filter-label {
          font-weight: 600;
          color: #555;
          font-size: 14px;
          margin-right: 10px;
        }

        .filter-select {
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 150px;
        }

        .filter-select:hover {
          border-color: #667eea;
        }

        .filter-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .btn-clear {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .actions-section {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        .actions-left {
          flex: 1;
        }

        .actions-hint {
          margin: 0;
          color: #555;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .actions-right {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .action-buttons-inline {
          display: flex;
          gap: 5px;
        }

        .results-section {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .results-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .results-header h2 {
          margin: 0;
          color: #333;
        }

        .filter-badge {
          font-size: 14px;
          color: #667eea;
          font-weight: normal;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #999;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .empty-state h3 {
          margin: 0 0 10px 0;
          color: #666;
        }

        .empty-state p {
          margin: 0;
          font-size: 14px;
        }

        .badge {
          display: inline-block;
          padding: 4px 12px;
          background: #e3f2fd;
          color: #1976d2;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #999;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default Home;
