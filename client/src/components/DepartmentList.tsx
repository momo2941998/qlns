import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchDepartments } from '../features/departments/departmentSlice';

const DepartmentList = () => {
  const dispatch = useAppDispatch();
  const { departments, loading, error } = useAppSelector((state) => state.departments);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div>
      <h2>Danh sách Phòng ban</h2>
      <ul>
        {departments.map((dept) => (
          <li key={dept._id}>
            {dept.stt}. {dept.ten}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DepartmentList;
