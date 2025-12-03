/**
 * Lấy URL đầy đủ cho avatar từ filename
 * Backend chỉ trả về filename, client tự tạo URL
 */
export const getAvatarUrl = (filename?: string): string => {
  if (!filename) return '';

  // Nếu đã là URL đầy đủ hoặc path đầy đủ, trả về luôn
  if (filename.startsWith('http') || filename.startsWith('/')) {
    return filename;
  }

  // Tạo URL từ filename
  // Backend serve tại /uploads/avatar
  return `${import.meta.env.VITE_API_URL}/uploads/avatar/${filename}`;
};
