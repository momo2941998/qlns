import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchEmployees, deleteEmployee } from '../features/employees/employeeSlice';
import { Employee } from '../types';
import { formatDateToYYYYMMDD } from '../utils/dateFormat';
import { getAvatarUrl } from '../utils/imageUrl';
import EmployeeForm from './EmployeeForm';

const EmployeeList = () => {
  const dispatch = useAppDispatch();
  const { employees, loading, error } = useAppSelector((state) => state.employees);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleAdd = () => {
    setEditingEmployee(undefined);
    setShowForm(true);
  };

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

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div className="section">
      <div className="section-header">
        <h2>Danh sách Nhân viên</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Thêm nhân viên
        </button>
      </div>

      {employees.length === 0 ? (
        <p className="empty-message">Chưa có nhân viên nào</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Avatar</th>
                <th>Họ tên</th>
                <th>Chức danh</th>
                <th>Giới tính</th>
                <th>Ngày sinh</th>
                <th>Phòng ban</th>
                <th>Email</th>
                <th>SĐT</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
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
                          border: '1px solid #ddd'
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
                          color: '#666'
                        }}
                      >
                        {emp.hoTen.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td>{emp.hoTen}</td>
                  <td>{emp.chucDanh}</td>
                  <td>{emp.gioiTinh}</td>
                  <td>{formatDateToYYYYMMDD(emp.ngaySinh)}</td>
                  <td>{emp.department?.ten || 'N/A'}</td>
                  <td>{emp.email}</td>
                  <td>{emp.sdt}</td>
                  <td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <EmployeeForm employee={editingEmployee} onClose={handleCloseForm} />
      )}
    </div>
  );
};

export default EmployeeList;
