export const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzLNqFbR-TUzjiN3pOgF0WnpWC7y0Q1TmyQFcwAzDhmx2V5Z9wqmJCE4qTzGIm367a0/exec";

export const CATEGORY_OPTIONS = [
  "ร้านอาหาร",
  "คาเฟ่",
  "แฟชั่น",
  "สุขภาพ",
  "บริการ",
  "อื่นๆ",
] as const;

export interface UploadedFile {
  name: string;
  type: string;
  /** base64 data URL */
  data: string;
}

export interface MerchantFormValues {
  storeName: string;
  logo: UploadedFile | null;
  mapsLink: string;
  openingHours: string;
  contactName: string;
  contactPhone: string;
  category: string;
  contactChannels: string;
  promotionDetails: string;
  storeDescription: string;
  photos: UploadedFile[];
  consent: boolean;
}

export const emptyMerchantForm: MerchantFormValues = {
  storeName: "",
  logo: null,
  mapsLink: "",
  openingHours: "",
  contactName: "",
  contactPhone: "",
  category: "",
  contactChannels: "",
  promotionDetails: "",
  storeDescription: "",
  photos: [],
  consent: false,
};

export type RequiredField =
  | "storeName"
  | "logo"
  | "mapsLink"
  | "openingHours"
  | "contactName"
  | "contactPhone"
  | "category"
  | "contactChannels"
  | "promotionDetails"
  | "consent";

export const REQUIRED_FIELDS: RequiredField[] = [
  "storeName",
  "logo",
  "mapsLink",
  "openingHours",
  "contactName",
  "contactPhone",
  "category",
  "contactChannels",
  "promotionDetails",
  "consent",
];

export function validateMerchantForm(
  values: MerchantFormValues,
): Partial<Record<RequiredField, string>> {
  const errors: Partial<Record<RequiredField, string>> = {};

  if (!values.storeName.trim()) errors.storeName = "กรุณากรอกชื่อร้านค้า";
  if (!values.logo) errors.logo = "กรุณาอัปโหลดโลโก้ร้านค้า";
  if (!values.mapsLink.trim()) errors.mapsLink = "กรุณาใส่ลิงก์ Google Maps";
  if (!values.openingHours.trim()) errors.openingHours = "กรุณาระบุเวลาเปิด-ปิดร้าน";
  if (!values.contactName.trim()) errors.contactName = "กรุณากรอกชื่อผู้ติดต่อ";
  if (!values.contactPhone.trim()) {
    errors.contactPhone = "กรุณากรอกเบอร์โทรผู้ติดต่อ";
  } else if (!/^[0-9+\-\s]{6,20}$/.test(values.contactPhone.trim())) {
    errors.contactPhone = "รูปแบบเบอร์โทรไม่ถูกต้อง";
  }
  if (!values.category) errors.category = "กรุณาเลือกหมวดหมู่ร้านค้า";
  if (!values.contactChannels.trim()) errors.contactChannels = "กรุณาระบุช่องทางติดต่อร้าน";
  if (!values.promotionDetails.trim()) errors.promotionDetails = "กรุณากรอกรายละเอียดคูปอง / โปรโมชัน";
  if (!values.consent) errors.consent = "กรุณายอมรับเงื่อนไขและนโยบายความเป็นส่วนตัว";

  return errors;
}

export function isMerchantFormComplete(values: MerchantFormValues): boolean {
  return Object.keys(validateMerchantForm(values)).length === 0;
}

export function fileToUploadedFile(file: File): Promise<UploadedFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({ name: file.name, type: file.type, data: String(reader.result) });
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function submitMerchantForm(values: MerchantFormValues): Promise<void> {
  const payload = {
    storeName: values.storeName,
    googleMapsLink: values.mapsLink,
    openingHours: values.openingHours,
    contactName: values.contactName,
    contactPhone: values.contactPhone,
    storeCategory: values.category,
    contactChannel: values.contactChannels,
    promotionDetail: values.promotionDetails,
    storeDescription: values.storeDescription,
    note: "",
  };

  const res = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Submit failed with status ${res.status}`);
  }

  let result: { success?: boolean; error?: string };
  try {
    result = (await res.json()) as { success?: boolean; error?: string };
  } catch {
    throw new Error("Google Apps Script returned an invalid response");
  }

  if (result.success !== true) {
    throw new Error(result.error ?? "Google Apps Script could not save the form");
  }
}
