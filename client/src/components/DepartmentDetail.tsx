import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchEmployees, deleteEmployee } from '../features/employees/employeeSlice';
import { Department, Employee } from '../types';
import { formatDateToYYYYMMDD } from '../utils/dateFormat';

interface DepartmentDetailProps {
  department: Department;
  onClose: () => void;
}

interface ColumnConfig {
  key: string;
  label: string;
  render: (emp: Employee) => any;
}

const DepartmentDetail = ({ department, onClose }: DepartmentDetailProps) => {
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector((state) => state.employees);
  const [deleting, setDeleting] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Định nghĩa tất cả các cột có thể hiển thị
  const allColumns: ColumnConfig[] = [
    { key: 'stt', label: 'STT', render: (emp) => emp.stt },
    { key: 'hoTen', label: 'Họ tên', render: (emp) => emp.hoTen },
    { key: 'chucDanh', label: 'Chức danh', render: (emp) => emp.chucDanh },
    { key: 'gioiTinh', label: 'Giới tính', render: (emp) => emp.gioiTinh },
    { key: 'ngaySinh', label: 'Ngày sinh', render: (emp) => formatDateToYYYYMMDD(emp.ngaySinh) },
    { key: 'email', label: 'Email', render: (emp) => emp.email },
    { key: 'sdt', label: 'SĐT', render: (emp) => emp.sdt },
    { key: 'canCuoc', label: 'Căn cước', render: (emp) => emp.canCuoc?.soThe },
    { key: 'maSoBHXH', label: 'Mã số BHXH', render: (emp) => emp.maSoBHXH },
    { key: 'maSoThue', label: 'Mã số thuế', render: (emp) => emp.maSoThue },
    { key: 'queQuan', label: 'Quê quán', render: (emp) => emp.queQuan },
    { key: 'diaChiHienTai', label: 'Địa chỉ hiện tại', render: (emp) => emp.diaChiHienTai },
    { key: 'trinhDo', label: 'Trình độ', render: (emp) => emp.trinhDoChuyenMon?.loaiBang },
    { key: 'chuyenNganh', label: 'Chuyên ngành', render: (emp) => emp.trinhDoChuyenMon?.chuyenNganh },
    { key: 'phanTo', label: 'Phân tổ', render: (emp) => emp.phanTo },
    { key: 'diaChiIP', label: 'Địa chỉ IP', render: (emp) => emp.diaChiIP },
  ];

  // Load visible columns từ localStorage hoặc dùng mặc định
  const defaultVisibleColumns = ['stt', 'hoTen', 'chucDanh', 'gioiTinh', 'email', 'sdt'];
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const saved = localStorage.getItem(`dept-${department._id}-columns`);
    return saved ? JSON.parse(saved) : defaultVisibleColumns;
  });

  // Lọc nhân viên thuộc phòng ban này
  const departmentEmployees = employees.filter(
    (emp) => emp.department?._id === department._id
  );

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Đóng column selector khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showColumnSelector && !target.closest('.column-selector-container')) {
        setShowColumnSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColumnSelector]);

  const handleDeleteAll = async () => {
    if (departmentEmployees.length === 0) {
      alert('Không có nhân viên nào để xóa');
      return;
    }

    const confirmMessage = `Bạn có chắc chắn muốn xóa TẤT CẢ ${departmentEmployees.length} nhân viên trong phòng ban "${department.ten}"?\n\nHành động này không thể hoàn tác!`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setDeleting(true);

    try {
      // Xóa từng nhân viên
      for (const emp of departmentEmployees) {
        await dispatch(deleteEmployee(emp._id));
      }

      alert(`Đã xóa thành công ${departmentEmployees.length} nhân viên`);
      dispatch(fetchEmployees());
    } catch (error: any) {
      alert('Có lỗi xảy ra khi xóa nhân viên: ' + error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteOne = async (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên "${name}"?`)) {
      await dispatch(deleteEmployee(id));
      dispatch(fetchEmployees());
    }
  };

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns((prev) => {
      const newColumns = prev.includes(columnKey)
        ? prev.filter((k) => k !== columnKey)
        : [...prev, columnKey];

      // Lưu vào localStorage
      localStorage.setItem(`dept-${department._id}-columns`, JSON.stringify(newColumns));
      return newColumns;
    });
  };

  const resetColumns = () => {
    setVisibleColumns(defaultVisibleColumns);
    localStorage.setItem(`dept-${department._id}-columns`, JSON.stringify(defaultVisibleColumns));
  };

  // Lọc các cột hiển thị
  const displayedColumns = allColumns.filter((col) => visibleColumns.includes(col.key));

  // Sắp xếp dữ liệu
  const sortedEmployees = [...departmentEmployees].sort((a, b) => {
    if (!sortColumn) return 0;

    const column = allColumns.find((col) => col.key === sortColumn);
    if (!column) return 0;

    const aValue = column.render(a);
    const bValue = column.render(b);

    // Xử lý giá trị null/undefined
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortDirection === 'asc' ? 1 : -1;
    if (bValue == null) return sortDirection === 'asc' ? -1 : 1;

    // So sánh số
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // So sánh chuỗi
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();

    if (sortDirection === 'asc') {
      return aStr.localeCompare(bStr, 'vi');
    } else {
      return bStr.localeCompare(aStr, 'vi');
    }
  });

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      // Toggle direction nếu click vào cùng cột
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set cột mới và reset direction về asc
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-large">
        <div className="department-detail-header">
          <div>
            <h2>Chi tiết Phòng ban</h2>
            <div className="department-info">
              <p><strong>STT:</strong> {department.stt}</p>
              <p><strong>Tên:</strong> {department.ten}</p>
              <p><strong>Số nhân viên:</strong> {departmentEmployees.length}</p>
            </div>
          </div>
          <button className="btn btn-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="department-detail-actions">
          <h3>Danh sách Nhân viên</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="column-selector-container" style={{ position: 'relative' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowColumnSelector(!showColumnSelector)}
              >
                ⚙️ Chọn cột hiển thị
              </button>
              {showColumnSelector && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '5px',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    minWidth: '200px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                  }}
                >
                  <div style={{ marginBottom: '10px', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                    Chọn cột hiển thị
                  </div>
                  {allColumns.map((col) => (
                    <label
                      key={col.key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '5px 0',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(col.key)}
                        onChange={() => toggleColumn(col.key)}
                        style={{ marginRight: '8px' }}
                      />
                      {col.label}
                    </label>
                  ))}
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={resetColumns}
                      style={{ width: '100%' }}
                    >
                      Đặt lại mặc định
                    </button>
                  </div>
                </div>
              )}
            </div>
            {departmentEmployees.length > 0 && (
              <button
                className="btn btn-delete"
                onClick={handleDeleteAll}
                disabled={deleting}
              >
                {deleting ? 'Đang xóa...' : `Xóa tất cả (${departmentEmployees.length})`}
              </button>
            )}
          </div>
        </div>

        {departmentEmployees.length === 0 ? (
          <p className="empty-message">Chưa có nhân viên nào trong phòng ban này</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  {displayedColumns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      {col.label}
                      {sortColumn === col.key && (
                        <span style={{ marginLeft: '5px' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                  ))}
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {sortedEmployees.map((emp) => (
                  <tr key={emp._id}>
                    {displayedColumns.map((col) => (
                      <td key={col.key}>{col.render(emp)}</td>
                    ))}
                    <td>
                      <button
                        className="btn btn-sm btn-delete"
                        onClick={() => handleDeleteOne(emp._id, emp.hoTen)}
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

        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;
