/**
 * Format date to YYYY-MM-DD
 */
export const formatDateToYYYYMMDD = (date: string | Date | undefined): string => {
  if (!date) return '';

  const d = new Date(date);

  // Kiểm tra date hợp lệ
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
