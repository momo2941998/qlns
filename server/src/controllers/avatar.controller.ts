import { Request, Response } from 'express';
import { ImageService } from '../services/image.service';
import Employee from '../models/Employee';

const imageService = new ImageService();

export class AvatarController {
  /**
   * Upload avatar cho nhân viên
   * Nhận ảnh đã được crop từ client (base64)
   */
  async uploadAvatar(req: Request, res: Response) {
    try {
      const { employeeId, image } = req.body;

      if (!employeeId) {
        return res.status(400).json({ message: 'Thiếu employeeId' });
      }

      if (!image) {
        return res.status(400).json({ message: 'Thiếu ảnh' });
      }

      // Tìm nhân viên
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
      }

      // Xử lý base64 image
      // Format: data:image/png;base64,iVBORw0KGgo...
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');

      // Xóa avatar cũ nếu có
      if (employee.avatar) {
        await imageService.deleteAvatar(employee.avatar);
      }

      // Xử lý và lưu avatar mới (chỉ trả về filename)
      const filename = await imageService.processCroppedAvatar(imageBuffer);

      // Cập nhật employee với filename
      employee.avatar = filename;
      await employee.save();

      // Trả về filename cho client
      res.json({
        message: 'Upload avatar thành công',
        avatar: filename
      });

    } catch (error: any) {
      console.error('Lỗi upload avatar:', error);
      res.status(500).json({ message: error.message || 'Lỗi server' });
    }
  }

  /**
   * Xóa avatar của nhân viên
   */
  async deleteAvatar(req: Request, res: Response) {
    try {
      const { employeeId } = req.params;

      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
      }

      // Xóa file avatar
      if (employee.avatar) {
        await imageService.deleteAvatar(employee.avatar);
        employee.avatar = undefined;
        await employee.save();
      }

      res.json({ message: 'Xóa avatar thành công' });

    } catch (error: any) {
      console.error('Lỗi xóa avatar:', error);
      res.status(500).json({ message: error.message || 'Lỗi server' });
    }
  }
}
