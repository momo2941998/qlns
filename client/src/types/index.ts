export interface Department {
  _id: string;
  stt: number;
  ten: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  _id: string;
  stt: number;
  hoTen: string;
  chucDanh: string;
  gioiTinh: 'Nam' | 'Nữ' | 'Khác';
  ngaySinh?: string;
  sdt: string;
  canCuoc: {
    soThe: string;
    ngayCap: string;
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
  thoiGianBatDauLamViec: string;
  phanTo: string;
  diaChiIP: string;
  email: string;
  ghiChu: string;
  department: Department;
  createdAt: string;
  updatedAt: string;
}
