import { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { avatarAPI } from '../services/api';
import { getAvatarUrl } from '../utils/imageUrl';

interface ImageCropUploadProps {
  employeeId: string;
  currentAvatar?: string;
  onUploadSuccess: (avatarPath: string) => void;
  onUploadError?: (error: string) => void;
}

const ImageCropUpload = ({
  employeeId,
  currentAvatar,
  onUploadSuccess,
  onUploadError,
}: ImageCropUploadProps) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Xử lý file (dùng chung cho input và drag-drop)
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImgSrc(reader.result?.toString() || '');
    });
    reader.readAsDataURL(file);
  };

  // Xử lý khi chọn file từ input
  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  // Xử lý drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // Xử lý drag leave
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Xử lý drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Convert canvas thành base64
  const getCroppedImg = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!completedCrop || !imgRef.current) {
        reject('No crop defined');
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject('No 2d context');
        return;
      }

      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      resolve(canvas.toDataURL('image/png'));
    });
  };

  // Upload ảnh đã crop
  const handleUpload = async () => {
    console.log('🔵 handleUpload called');
    console.log('Employee ID:', employeeId);
    console.log('Completed Crop:', completedCrop);

    try {
      setUploading(true);

      const croppedImage = await getCroppedImg();
      console.log('🔵 Cropped image (base64 length):', croppedImage.length);

      const response = await avatarAPI.upload(employeeId, croppedImage);
      console.log('🔵 Upload response:', response.data);

      onUploadSuccess(response.data.avatar);

      // Reset form
      setImgSrc('');
      setCrop({
        unit: '%',
        width: 90,
        height: 90,
        x: 5,
        y: 5,
      });
      setCompletedCrop(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi upload ảnh';
      console.error('Upload error:', errorMessage);
      if (onUploadError) {
        onUploadError(errorMessage);
      } else {
        alert(errorMessage);
      }
    } finally {
      setUploading(false);
    }
  };

  // Xóa avatar
  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ảnh đại diện?')) {
      return;
    }

    try {
      setUploading(true);
      await avatarAPI.delete(employeeId);
      onUploadSuccess('');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Lỗi xóa ảnh';
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Hủy crop
  const handleCancel = () => {
    setImgSrc('');
    setCrop({
      unit: '%',
      width: 90,
      height: 90,
      x: 5,
      y: 5,
    });
    setCompletedCrop(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-crop-upload">
      <div className="avatar-preview">
        {currentAvatar ? (
          <div className="current-avatar">
            <img
              src={getAvatarUrl(currentAvatar)}
              alt="Avatar"
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '50%',
                border: '2px solid #ddd',
              }}
            />
            <button
              type="button"
              className="btn btn-sm btn-delete"
              onClick={handleDelete}
              disabled={uploading}
              style={{ marginTop: '10px' }}
            >
              Xóa ảnh
            </button>
          </div>
        ) : (
          <div
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              border: '2px dashed #ddd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
            }}
          >
            Chưa có ảnh
          </div>
        )}
      </div>

      <div className="upload-controls" style={{ marginTop: '20px' }}>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: isDragging ? '2px dashed #4CAF50' : '2px dashed #ccc',
            borderRadius: '8px',
            padding: '30px',
            textAlign: 'center',
            backgroundColor: isDragging ? '#f0f8ff' : '#fafafa',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '10px'
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📸</div>
          <p style={{ margin: '10px 0', fontWeight: 'bold', color: '#333' }}>
            {isDragging ? 'Thả ảnh vào đây' : 'Kéo thả ảnh vào đây'}
          </p>
          <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
            hoặc click để chọn file
          </p>
          <p style={{ margin: '5px 0', color: '#999', fontSize: '12px' }}>
            Hỗ trợ: JPG, PNG, GIF, WebP
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {imgSrc && (
        <div className="crop-container" style={{ marginTop: '20px' }}>
          <ReactCrop
            crop={crop}
            onChange={(c) => {
              console.log('🟡 Crop onChange:', c);
              setCrop(c);
            }}
            onComplete={(c) => {
              console.log('🟢 Crop onComplete:', c);
              setCompletedCrop(c);
            }}
            aspect={1}
            circularCrop
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Crop"
              style={{ maxWidth: '100%', maxHeight: '400px' }}
            />
          </ReactCrop>

          <div style={{ marginTop: '10px' }}>
            {/* Debug info */}
            <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px', fontSize: '12px' }}>
              <div>✅ Image selected: {imgSrc ? 'Yes' : 'No'}</div>
              <div>✅ Crop completed: {completedCrop ? 'Yes' : 'No'}</div>
              <div>✅ Button enabled: {completedCrop && !uploading ? 'Yes' : 'No'}</div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={!completedCrop || uploading}
              >
                {uploading ? 'Đang upload...' : 'Upload ảnh'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={uploading}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCropUpload;
