import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchEmployees } from '../features/employees/employeeSlice';

const EmployeeList = () => {
  const dispatch = useAppDispatch();
  const { employees, loading, error } = useAppSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div>
      <h2>Danh sách Nhân viên</h2>
      {employees.length === 0 ? (
        <p>Chưa có nhân viên nào</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ tên</th>
              <th>Chức danh</th>
              <th>Giới tính</th>
              <th>Phòng ban</th>
              <th>Email</th>
              <th>SĐT</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.stt}</td>
                <td>{emp.hoTen}</td>
                <td>{emp.chucDanh}</td>
                <td>{emp.gioiTinh}</td>
                <td>{emp.department?.ten || 'N/A'}</td>
                <td>{emp.email}</td>
                <td>{emp.sdt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeList;
