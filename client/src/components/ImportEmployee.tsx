import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchDepartments } from '../features/departments/departmentSlice';
import { fetchEmployees } from '../features/employees/employeeSlice';
import axios from 'axios';
import * as XLSX from 'xlsx';

const ImportEmployee = () => {
  const dispatch = useAppDispatch();
  const { departments } = useAppSelector((state) => state.departments);
  const [file, setFile] = useState<File | null>(null);
  const [departmentId, setDepartmentId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Vui lòng chọn file Excel');
      return;
    }

    if (!departmentId) {
      alert('Vui lòng chọn phòng ban');
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('departmentId', departmentId);

      const response = await axios.post('/api/import/employees', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data.result);

      // Reload danh sách nhân viên
      dispatch(fetchEmployees());

      // Reset form
      setFile(null);
      setDepartmentId('');
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      alert('Import thất bại: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Tạo template Excel
    const headers = [
      'STT',
      'Họ tên',
      'Chức danh',
      'Giới tính',
      'Ngày sinh',
      'SĐT',
      'Số thẻ CC',
      'Ngày cấp CC',
      'Nơi cấp CC',
      'Loại bằng',
      'Năm tốt nghiệp',
      'Chuyên ngành',
      'Trường Đại học',
      'Mã số BHXH',
      'Mã số thuế',
      'Quê quán',
      'Địa chỉ hiện tại',
      'Thời gian bắt đầu làm việc',
      'Phân tổ',
      'Địa chỉ IP',
      'Địa chỉ email',
      'Ghi chú',
    ];

    // Tạo workbook và worksheet
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Nhân viên');

    // Download file Excel
    XLSX.writeFile(wb, 'template_nhan_vien.xlsx');
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>Import Nhân viên từ Excel</h2>
        <button className="btn btn-secondary" onClick={downloadTemplate}>
          Tải template
        </button>
      </div>

      <div className="import-container">
        <form onSubmit={handleImport} className="import-form">
          <div className="form-group">
            <label>Chọn phòng ban:</label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              required
            >
              <option value="">-- Chọn phòng ban --</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.ten}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Chọn file Excel:</label>
            <input
              id="file-input"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              required
            />
            {file && <p className="file-info">File đã chọn: {file.name}</p>}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploading || !file || !departmentId}
            >
              {uploading ? 'Đang import...' : 'Import'}
            </button>
          </div>
        </form>

        {result && (
          <div className="import-result">
            <h3>Kết quả import</h3>
            <div className="result-stats">
              <div className="stat success">
                <span className="label">Thành công:</span>
                <span className="value">{result.success}</span>
              </div>
              <div className="stat created">
                <span className="label">Tạo mới:</span>
                <span className="value">{result.created}</span>
              </div>
              <div className="stat updated">
                <span className="label">Cập nhật:</span>
                <span className="value">{result.updated}</span>
              </div>
              <div className="stat failed">
                <span className="label">Thất bại:</span>
                <span className="value">{result.failed}</span>
              </div>
            </div>

            {result.errors && result.errors.length > 0 && (
              <div className="errors">
                <h4>Lỗi chi tiết:</h4>
                <ul>
                  {result.errors.map((error: string, index: number) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="import-guide">
          <h3>Hướng dẫn</h3>
          <ol>
            <li>Tải file template Excel bằng nút "Tải template"</li>
            <li>Mở file Excel và điền thông tin nhân viên</li>
            <li>Lưu file (định dạng .xlsx hoặc .xls)</li>
            <li>Chọn phòng ban cho các nhân viên sẽ được import</li>
            <li>Chọn file Excel và nhấn "Import"</li>
          </ol>
          <p className="note">
            <strong>Lưu ý:</strong> Các trường bắt buộc: STT, Họ tên, Giới tính, Ngày sinh
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImportEmployee;
