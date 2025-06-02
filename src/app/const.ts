import { en_US, km_KH, zh_CN } from "ng-zorro-antd/i18n";

export const APP_STORAGE_KEY = {
  Authorized: "authorized",
  RefreshToken: "RefreshToken",
  Language: "vip-lang",
  Tenant: "vip-tenant",
  App: "vip-appinfo",
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

export const ADDRESS_FILTER_OPTION = {
  Province: "province",
  District: "district",
  Commune: "commune",
  Village: "village",
};

export const REPORT_NAME = {
  Complain: "ListOfComplaint",
  Individual: "Individual",
  AuditAndTracking: "AuditAndTracking",
  Management: "Management",
  ManagementChart: "ManagementChart",
  Operational: "Operational",
  UserRetrievingData: "UserRetrievingData",
};

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
 APP : 38000,
 APP__AGENT : 38002,
 APP__AGENT__ADD : 38013,
 APP__AGENT__EDIT : 38014,
 APP__AGENT__LIST : 38012,
 APP__AGENT__REMOVE : 38016,
 APP__AGENT__VIEW : 38015,
 APP__MEMBER : 38001,
 APP__MEMBER__ADD : 38008,
 APP__MEMBER__EDIT : 38009,
 APP__MEMBER__LIST : 38007,
 APP__MEMBER__REMOVE : 38011,
 APP__MEMBER__VIEW : 38010,
 APP__OFFER : 38003,
 APP__OFFER__ADD : 38018,
 APP__OFFER__EDIT : 38019,
 APP__OFFER__LIST : 38017,
 APP__OFFER__REMOVE : 38021,
 APP__OFFER__VIEW : 38020,
 APP__REDEMPTION : 38004,
 APP__REDEMPTION__ADD : 38023,
 APP__REDEMPTION__EDIT : 38024,
 APP__REDEMPTION__LIST : 38022,
 APP__REDEMPTION__REMOVE : 38026,
 APP__REDEMPTION__VIEW : 38025,
 APP__REPORT : 38006,
 APP__SETTING : 38005,
 APP__SETTING__AUTO_NUMBER : 38034,
 APP__SETTING__BRANCH : 38028,
 APP__SETTING__CURRENCY : 38031,
 APP__SETTING__LOCATION : 38032,
 APP__SETTING__LOOKUP : 38027,
 APP__SETTING__MEMBER_CLASS : 38029,
 APP__SETTING__OFFER_GROUP : 38030,
 APP__SETTING__REPORT : 38035,
 APP__SETTING__SYSTEM_SETTING : 38033,
}
