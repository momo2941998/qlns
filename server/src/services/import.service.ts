import * as XLSX from 'xlsx';
import Employee from '../models/Employee';

interface ImportResult {
  success: number;
  created: number;
  updated: number;
  failed: number;
  errors: string[];
}

export class ImportService {
  async importEmployeesFromExcel(fileBuffer: Buffer, departmentId: string): Promise<ImportResult> {
    const result: ImportResult = {
      success: 0,
      created: 0,
      updated: 0,
      failed: 0,
      errors: []
    };

    try {
      // Đọc file Excel từ buffer (memory)
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert sang JSON
      const data: any[] = XLSX.utils.sheet_to_json(worksheet);

      // Xử lý từng dòng
      for (let i = 0; i < data.length; i++) {
        const row = data[i];

        try {
          // Map columns theo thứ tự trong Employee.txt
          const employeeData = {
            stt: row['STT'] || i + 1,
            hoTen: row['Họ tên'] || '',
            chucDanh: row['Chức danh'] || '',
            gioiTinh: row['Giới tính'] || 'Khác',
            ngaySinh: this.parseDate(row['Ngày sinh']),
            sdt: row['SĐT'] ? String(row['SĐT']) : '',
            canCuoc: {
              soThe: row['Số thẻ CC'] ? String(row['Số thẻ CC']) : '',
              ngayCap: this.parseDate(row['Ngày cấp CC']),
              noiCap: row['Nơi cấp CC'] || '',
            },
            trinhDoChuyenMon: {
              loaiBang: row['Loại bằng'] || '',
              namTotNghiep: row['Năm tốt nghiệp'] ? String(row['Năm tốt nghiệp']) : undefined,
              chuyenNganh: row['Chuyên ngành'] || '',
              truongDaiHoc: row['Trường Đại học'] || '',
            },
            maSoBHXH: row['Mã số BHXH'] ? String(row['Mã số BHXH']) : '',
            maSoThue: row['Mã số thuế'] ? String(row['Mã số thuế']) : '',
            queQuan: row['Quê quán'] || '',
            diaChiHienTai: row['Địa chỉ hiện tại'] || '',
            thoiGianBatDauLamViec: this.parseDate(row['Thời gian bắt đầu làm việc']),
            phanTo: row['Phân tổ'] || '',
            diaChiIP: row['Địa chỉ IP'] || '',
            email: row['Địa chỉ email'] || '',
            ghiChu: row['Ghi chú'] || '',
            department: departmentId,
          };

          // Validate required fields
          if (!employeeData.hoTen) {
            result.errors.push(`Dòng ${i + 2}: Thiếu họ tên`);
            result.failed++;
            continue;
          }

          // Kiểm tra nhân viên đã tồn tại (dựa vào STT)
          const existingEmployee = await Employee.findOne({ stt: employeeData.stt });

          if (existingEmployee) {
            // Update nhân viên hiện có
            await Employee.findByIdAndUpdate(existingEmployee._id, employeeData);
            result.updated++;
            result.success++;
          } else {
            // Tạo nhân viên mới
            const employee = new Employee(employeeData);
            await employee.save();
            result.created++;
            result.success++;
          }

        } catch (error: any) {
          result.errors.push(`Dòng ${i + 2}: ${error.message}`);
          console.error(`Dòng ${i + 2}: ${error.message}`);
          result.failed++;
        }
      }

      // File đã được xử lý trong memory, không cần xóa

    } catch (error: any) {
      result.errors.push(`Lỗi đọc file: ${error.message}`);
    }

    return result;
  }

  private parseDate(dateValue: any): Date | undefined {
    if (!dateValue) return undefined;

    // Nếu là Excel date number
    if (typeof dateValue === 'number') {
      const excelEpoch = new Date(1899, 11, 30);
      const msPerDay = 24 * 60 * 60 * 1000;
      const date = new Date(excelEpoch.getTime() + dateValue * msPerDay);
      return this.normalizeDate(date);
    }

    // Nếu là string
    if (typeof dateValue === 'string') {
      const trimmedValue = dateValue.trim();

      // Format: DD/MM/YYYY hoặc DD-MM-YYYY
      const ddmmyyyyPattern = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/;
      const ddmmyyyyMatch = trimmedValue.match(ddmmyyyyPattern);
      if (ddmmyyyyMatch) {
        const day = parseInt(ddmmyyyyMatch[1], 10);
        const month = parseInt(ddmmyyyyMatch[2], 10) - 1;
        const year = parseInt(ddmmyyyyMatch[3], 10);
        return this.normalizeDate(new Date(year, month, day));
      }

      // Format: YYYY-MM-DD hoặc YYYY/MM/DD (ISO format)
      const yyyymmddPattern = /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/;
      const yyyymmddMatch = trimmedValue.match(yyyymmddPattern);
      if (yyyymmddMatch) {
        const year = parseInt(yyyymmddMatch[1], 10);
        const month = parseInt(yyyymmddMatch[2], 10) - 1;
        const day = parseInt(yyyymmddMatch[3], 10);
        return this.normalizeDate(new Date(year, month, day));
      }

      // Format: MM/DD/YYYY (US format)
      const mmddyyyyPattern = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/;
      // Để phân biệt DD/MM/YYYY và MM/DD/YYYY, ta ưu tiên DD/MM/YYYY (đã xử lý ở trên)
      // Nếu ngày > 12 thì chắc chắn là DD/MM/YYYY
      const mmddyyyyMatch = trimmedValue.match(mmddyyyyPattern);
      if (mmddyyyyMatch) {
        const first = parseInt(mmddyyyyMatch[1], 10);
        const second = parseInt(mmddyyyyMatch[2], 10);
        const year = parseInt(mmddyyyyMatch[3], 10);

        // Nếu first > 12, chắc chắn là DD/MM/YYYY (đã xử lý ở trên)
        // Nếu second > 12, chắc chắn là MM/DD/YYYY
        if (second > 12) {
          return this.normalizeDate(new Date(year, first - 1, second));
        }
      }

      // Format: MM/YYYY hoặc MM-YYYY
      const mmyyyyPattern = /^(\d{1,2})[\/\-](\d{4})$/;
      const mmyyyyMatch = trimmedValue.match(mmyyyyPattern);
      if (mmyyyyMatch) {
        const month = parseInt(mmyyyyMatch[1], 10) - 1;
        const year = parseInt(mmyyyyMatch[2], 10);
        return this.normalizeDate(new Date(year, month, 1));
      }

      // Format: YYYY
      const yyyyPattern = /^(\d{4})$/;
      const yyyyMatch = trimmedValue.match(yyyyPattern);
      if (yyyyMatch) {
        const year = parseInt(yyyyMatch[1], 10);
        return this.normalizeDate(new Date(year, 0, 1));
      }

      // Format: DD.MM.YYYY (European format)
      const ddmmyyyyDotPattern = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
      const ddmmyyyyDotMatch = trimmedValue.match(ddmmyyyyDotPattern);
      if (ddmmyyyyDotMatch) {
        const day = parseInt(ddmmyyyyDotMatch[1], 10);
        const month = parseInt(ddmmyyyyDotMatch[2], 10) - 1;
        const year = parseInt(ddmmyyyyDotMatch[3], 10);
        return this.normalizeDate(new Date(year, month, day));
      }

      // Try ISO format or other standard formats
      const date = new Date(trimmedValue);
      if (!isNaN(date.getTime())) {
        return this.normalizeDate(date);
      }
    }

    // Nếu đã là Date object
    if (dateValue instanceof Date) {
      return this.normalizeDate(dateValue);
    }

    return undefined;
  }

  // Chuẩn hóa ngày về dạng YYYY-MM-DD (set giờ về 00:00:00 UTC)
  private normalizeDate(date: Date): Date {
    if (!date || isNaN(date.getTime())) return date;

    // Tạo Date mới với giờ UTC để tránh vấn đề timezone
    const normalized = new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0, 0, 0, 0
    ));

    return normalized;
  }
}
