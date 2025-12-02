import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  stt: number;
  hoTen: string;
  chucDanh: string;
  gioiTinh: string;
  ngaySinh?: Date;
  sdt: string;
  canCuoc: {
    soThe: string;
    ngayCap: Date;
    noiCap: string;
  };
  trinhDoChuyenMon: {
    loaiBang: string;
    namTotNghiep?: string;
    chuyenNganh: string;
    truongDaiHoc: string;
  };
  maSoBHXH: string;
  maSoThue: string;
  queQuan: string;
  diaChiHienTai: string;
  thoiGianBatDauLamViec: Date;
  phanTo: string;
  diaChiIP: string;
  email: string;
  ghiChu: string;
  department: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema: Schema = new Schema(
  {
    stt: { type: Number, required: true, unique: true },
    hoTen: { type: String, required: true, trim: true },
    chucDanh: { type: String, trim: true },
    gioiTinh: { type: String, enum: ['Nam', 'Nữ', 'Khác'], required: true },
    ngaySinh: { type: Date },
    sdt: { type: String, trim: true },
    canCuoc: {
      soThe: { type: String, trim: true },
      ngayCap: { type: Date },
      noiCap: { type: String, trim: true },
    },
    trinhDoChuyenMon: {
      loaiBang: { type: String, trim: true },
      namTotNghiep: { type: String, trim: true },
      chuyenNganh: { type: String, trim: true },
      truongDaiHoc: { type: String, trim: true },
    },
    maSoBHXH: { type: String, trim: true },
    maSoThue: { type: String, trim: true },
    queQuan: { type: String, trim: true },
    diaChiHienTai: { type: String, trim: true },
    thoiGianBatDauLamViec: { type: Date },
    phanTo: { type: String, trim: true },
    diaChiIP: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    ghiChu: { type: String, trim: true },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);
