import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ENV } from '../config/environments';

export class ImageService {
  private uploadPath: string; // Đường dẫn tuyệt đối đến thư mục upload
  private uploadUrlPath: string; // Đường dẫn URL để trả về client

  constructor() {
    // Lưu đường dẫn từ ENV để tạo URL
    this.uploadUrlPath = ENV.UPLOAD_DIR;

    // Xây dựng đường dẫn tuyệt đối - uploadPath là absolute path
    this.uploadPath = path.isAbsolute(ENV.UPLOAD_DIR)
      ? ENV.UPLOAD_DIR
      : path.join(__dirname, '../../', ENV.UPLOAD_DIR);

    this.ensureUploadDir();
    console.log('📂 Upload directory (absolute):', this.uploadPath);
  }

  private ensureUploadDir() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  /**
   * Xử lý và lưu ảnh avatar
   * - Nén ảnh với Sharp
   * - Chuyển đổi sang WebP
   * - Resize về kích thước chuẩn (300x300)
   * @returns Chỉ trả về filename để lưu vào DB
   */
  async processAndSaveAvatar(imageBuffer: Buffer): Promise<string> {
    try {
      // Tạo tên file unique
      const filename = `${uuidv4()}.webp`;
      const filepath = path.join(this.uploadPath, filename);

      // Xử lý ảnh với Sharp
      await sharp(imageBuffer)
        // .resize(300, 300, {
        //   fit: 'cover',
        //   position: 'center'
        // })
        .webp({
          quality: 100, // Chất lượng 85% cho WebP
          effort: 6    // Level nén (0-6, cao hơn = nén tốt hơn nhưng chậm hơn)
        })
        .toFile(filepath);

      // Chỉ trả về filename
      return filename;
    } catch (error: any) {
      throw new Error(`Lỗi xử lý ảnh: ${error.message}`);
    }
  }

  /**
   * Xử lý ảnh đã được crop từ client
   * Client gửi ảnh đã crop, chỉ cần resize và convert
   * @returns Chỉ trả về filename để lưu vào DB
   */
  async processCroppedAvatar(imageBuffer: Buffer): Promise<string> {
    try {
      const filename = `${uuidv4()}.webp`;
      const filepath = path.join(this.uploadPath, filename);

      await sharp(imageBuffer)
        .resize(300, 300, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .webp({
          quality: 85,
          effort: 6
        })
        .toFile(filepath);

      // Chỉ trả về filename
      return filename;
    } catch (error: any) {
      throw new Error(`Lỗi xử lý ảnh: ${error.message}`);
    }
  }

  /**
   * Tạo URL đầy đủ từ filename
   * Sử dụng khi trả dữ liệu về client
   */
  getAvatarUrl(filename: string | undefined): string {
    if (!filename) return '';

    // Tạo đường dẫn URL từ ENV config
    const relativePath = this.uploadUrlPath.startsWith('/')
      ? this.uploadUrlPath
      : `/${this.uploadUrlPath}`;

    return `${relativePath}/${filename}`;
  }

  /**
   * Xóa ảnh cũ khi update
   */
  async deleteAvatar(avatarPath: string): Promise<void> {
    try {
      if (!avatarPath) return;

      // Lấy tên file từ path
      const filename = path.basename(avatarPath);
      const filepath = path.join(this.uploadPath, filename);

      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    } catch (error: any) {
      console.error(`Lỗi xóa ảnh: ${error.message}`);
      // Không throw error để không block việc update
    }
  }
}
