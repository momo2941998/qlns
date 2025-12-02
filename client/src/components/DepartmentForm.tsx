import { useState, useEffect } from 'react';
import { useAppDispatch } from '../app/hooks';
import { createDepartment, updateDepartment } from '../features/departments/departmentSlice';
import { Department } from '../types';

interface DepartmentFormProps {
  department?: Department;
  onClose: () => void;
}

const DepartmentForm = ({ department, onClose }: DepartmentFormProps) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    stt: department?.stt || 0,
    ten: department?.ten || '',
  });

  useEffect(() => {
    if (department) {
      setFormData({
        stt: department.stt,
        ten: department.ten,
      });
    }
  }, [department]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (department) {
      await dispatch(updateDepartment({ id: department._id, data: formData }));
    } else {
      await dispatch(createDepartment(formData));
    }

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{department ? 'Sửa Phòng ban' : 'Thêm Phòng ban'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>STT:</label>
            <input
              type="number"
              value={formData.stt}
              onChange={(e) => setFormData({ ...formData, stt: Number(e.target.value) })}
              required
            />
          </div>

          <div className="form-group">
            <label>Tên phòng ban:</label>
            <input
              type="text"
              value={formData.ten}
              onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {department ? 'Cập nhật' : 'Thêm mới'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentForm;
