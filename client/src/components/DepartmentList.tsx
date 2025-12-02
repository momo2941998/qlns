import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchDepartments, deleteDepartment } from '../features/departments/departmentSlice';
import { Department } from '../types';
import DepartmentForm from './DepartmentForm';

const DepartmentList = () => {
  const dispatch = useAppDispatch();
  const { departments, loading, error } = useAppSelector((state) => state.departments);
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | undefined>();

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleAdd = () => {
    setEditingDepartment(undefined);
    setShowForm(true);
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa phòng ban "${name}"?`)) {
      await dispatch(deleteDepartment(id));
      dispatch(fetchDepartments());
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDepartment(undefined);
    dispatch(fetchDepartments());
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div className="section">
      <div className="section-header">
        <h2>Danh sách Phòng ban</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Thêm phòng ban
        </button>
      </div>

      {departments.length === 0 ? (
        <p className="empty-message">Chưa có phòng ban nào</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên phòng ban</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept._id}>
                <td>{dept.stt}</td>
                <td>{dept.ten}</td>
                <td>
                  <button
                    className="btn btn-sm btn-edit"
                    onClick={() => handleEdit(dept)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-sm btn-delete"
                    onClick={() => handleDelete(dept._id, dept.ten)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <DepartmentForm
          department={editingDepartment}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default DepartmentList;
