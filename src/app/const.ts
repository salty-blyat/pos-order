import { en_US, km_KH, zh_CN } from "ng-zorro-antd/i18n";

export const APP_STORAGE_KEY = {
  Authorized: "authorized",
  RefreshToken: "RefreshToken",
  Language: "pos-order-lang",
  Tenant: "pos-order-tenant",
  App: "pos-order-appinfo",
};

export const BRANCH_STORAGE_KEY = "branchStorageKey";
export const SIDE_EXPAND_COLLAPSED = "sideExpandCollapsed";

export enum REPORT_RENDER_TYPES {
  HTML5 = 1,
  Excel = 2,
  Word = 3,
  Pdf = 4,
}

export enum PageSize {
  A1 = 1,
  A2 = 2,
  A3 = 3,
  A4 = 4,
  A5 = 5,
}
export enum Orientation {
  Portrait = 1,
  Landscape = 2,
}

export enum ReportParamDisplay {
  Inline = 1,
  Modal = 2,
}

export enum ItemAvailability {
  Yes = 1,
  No = 2,
  Hidden = 3,
}

export enum PenaltyType {
  FixedAmount = 1,
  Percentage = 2,
}

export enum DeadlineType {
  Day = 1,
  Hour = 2,
}

export enum RateType {
  Default = 1,
  Seasonal = 2,
}

export const PAGE_SIZE_OPTION = [10, 25, 50, 100]; 
export const Locale: { KH: any; EN: any; ZH: any; DEFAULT: any } | any = {
  KH: { local: km_KH, localId: "km" },
  EN: { local: en_US, localId: "en" },
  ZH: { local: zh_CN, localId: "zh" },
  DEFAULT: { local: km_KH, localId: "km" },
};

export const LANGUAGES: {
  key: { local: any; localId: string };
  image: string;
  label: string;
}[] = [
  { key: Locale.KH, label: "ភាសាខ្មែរ", image: "./assets/image/kh_FLAG.png" },
  { key: Locale.EN, label: "English", image: "./assets/image/en_FLAG.png" },
  { key: Locale.ZH, label: "中文", image: "./assets/image/ch_FLAG.png" },
];

export const SIZE_COLUMNS = {
  DRAG: "20px",
  ID: "45px",
  NAME: "200px",
  CODE: "100px",
  DESCRIPTION: "150px",
  ACTION: "180px",
  STATUS: "140px",
  DATE: "180px",
  DATE_RANGE: "220px",
  TOTAL: "150px",
  DROP: "8px",
  ICON: "30px",
  NOTE: "350px",
  PHONE: "200px",
  IMAGE: "80px",
  Amenity: "400px",
  GENDER: "100px",
  NORMAL: "12%",
  FORMAT: "150px",
  COLOR: "120px",
  SMALL: "50px",
  MEDIUM: "150px",
  LARGE: "300px",
};

export const AuthKeys = {
};
