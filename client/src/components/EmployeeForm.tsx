import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { createEmployee, updateEmployee } from '../features/employees/employeeSlice';
import { fetchDepartments } from '../features/departments/departmentSlice';
import { Employee } from '../types';
import { formatDateToYYYYMMDD } from '../utils/dateFormat';

interface EmployeeFormProps {
  employee?: Employee;
  onClose: () => void;
}

const EmployeeForm = ({ employee, onClose }: EmployeeFormProps) => {
  const dispatch = useAppDispatch();
  const { departments } = useAppSelector((state) => state.departments);

  const [formData, setFormData] = useState({
    stt: employee?.stt || 0,
    hoTen: employee?.hoTen || '',
    chucDanh: employee?.chucDanh || '',
    gioiTinh: employee?.gioiTinh || 'Nam',
    ngaySinh: formatDateToYYYYMMDD(employee?.ngaySinh) || '',
    sdt: employee?.sdt || '',
    canCuoc: {
      soThe: employee?.canCuoc?.soThe || '',
      ngayCap: formatDateToYYYYMMDD(employee?.canCuoc?.ngayCap) || '',
      noiCap: employee?.canCuoc?.noiCap || '',
    },
    trinhDoChuyenMon: {
      loaiBang: employee?.trinhDoChuyenMon?.loaiBang || '',
      namTotNghiep: employee?.trinhDoChuyenMon?.namTotNghiep || '',
      chuyenNganh: employee?.trinhDoChuyenMon?.chuyenNganh || '',
      truongDaiHoc: employee?.trinhDoChuyenMon?.truongDaiHoc || '',
    },
    maSoBHXH: employee?.maSoBHXH || '',
    maSoThue: employee?.maSoThue || '',
    queQuan: employee?.queQuan || '',
    diaChiHienTai: employee?.diaChiHienTai || '',
    thoiGianBatDauLamViec: formatDateToYYYYMMDD(employee?.thoiGianBatDauLamViec) || '',
    phanTo: employee?.phanTo || '',
    diaChiIP: employee?.diaChiIP || '',
    email: employee?.email || '',
    ghiChu: employee?.ghiChu || '',
    department: employee?.department?._id || '',
  });

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (employee) {
      await dispatch(updateEmployee({ id: employee._id, data: formData }));
    } else {
      await dispatch(createEmployee(formData));
    }

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-large">
        <h2>{employee ? 'Sửa Nhân viên' : 'Thêm Nhân viên'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
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
              <label>Họ tên:</label>
              <input
                type="text"
                value={formData.hoTen}
                onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Chức danh:</label>
              <input
                type="text"
                value={formData.chucDanh}
                onChange={(e) => setFormData({ ...formData, chucDanh: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Giới tính:</label>
              <select
                value={formData.gioiTinh}
                onChange={(e) => setFormData({ ...formData, gioiTinh: e.target.value })}
                required
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className="form-group">
              <label>Ngày sinh:</label>
              <input
                type="date"
                value={formData.ngaySinh}
                onChange={(e) => setFormData({ ...formData, ngaySinh: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại:</label>
              <input
                type="text"
                value={formData.sdt}
                onChange={(e) => setFormData({ ...formData, sdt: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Phòng ban:</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
          </div>

          <h3>Thông tin căn cước</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Số thẻ:</label>
              <input
                type="text"
                value={formData.canCuoc.soThe}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    canCuoc: { ...formData.canCuoc, soThe: e.target.value },
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Ngày cấp:</label>
              <input
                type="date"
                value={formData.canCuoc.ngayCap}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    canCuoc: { ...formData.canCuoc, ngayCap: e.target.value },
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Nơi cấp:</label>
              <input
                type="text"
                value={formData.canCuoc.noiCap}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    canCuoc: { ...formData.canCuoc, noiCap: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <h3>Trình độ chuyên môn</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Loại bằng:</label>
              <input
                type="text"
                value={formData.trinhDoChuyenMon.loaiBang}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    trinhDoChuyenMon: { ...formData.trinhDoChuyenMon, loaiBang: e.target.value },
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Năm tốt nghiệp:</label>
              <input
                type="text"
                value={formData.trinhDoChuyenMon.namTotNghiep}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    trinhDoChuyenMon: {
                      ...formData.trinhDoChuyenMon,
                      namTotNghiep: Number(e.target.value),
                    },
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Chuyên ngành:</label>
              <input
                type="text"
                value={formData.trinhDoChuyenMon.chuyenNganh}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    trinhDoChuyenMon: {
                      ...formData.trinhDoChuyenMon,
                      chuyenNganh: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Trường đại học:</label>
              <input
                type="text"
                value={formData.trinhDoChuyenMon.truongDaiHoc}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    trinhDoChuyenMon: {
                      ...formData.trinhDoChuyenMon,
                      truongDaiHoc: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>

          <h3>Thông tin khác</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Mã số BHXH:</label>
              <input
                type="text"
                value={formData.maSoBHXH}
                onChange={(e) => setFormData({ ...formData, maSoBHXH: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Mã số thuế:</label>
              <input
                type="text"
                value={formData.maSoThue}
                onChange={(e) => setFormData({ ...formData, maSoThue: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Quê quán:</label>
              <input
                type="text"
                value={formData.queQuan}
                onChange={(e) => setFormData({ ...formData, queQuan: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Địa chỉ hiện tại:</label>
              <input
                type="text"
                value={formData.diaChiHienTai}
                onChange={(e) => setFormData({ ...formData, diaChiHienTai: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Thời gian bắt đầu làm việc:</label>
              <input
                type="date"
                value={formData.thoiGianBatDauLamViec}
                onChange={(e) =>
                  setFormData({ ...formData, thoiGianBatDauLamViec: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Phân tổ:</label>
              <input
                type="text"
                value={formData.phanTo}
                onChange={(e) => setFormData({ ...formData, phanTo: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Địa chỉ IP:</label>
              <input
                type="text"
                value={formData.diaChiIP}
                onChange={(e) => setFormData({ ...formData, diaChiIP: e.target.value })}
              />
            </div>

            <div className="form-group full-width">
              <label>Ghi chú:</label>
              <textarea
                value={formData.ghiChu}
                onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {employee ? 'Cập nhật' : 'Thêm mới'}
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

export default EmployeeForm;
