import { useMemo, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { FormField } from "./FormField";
import { MultiImageUpload, SingleImageUpload } from "./ImageUpload";
import {
  CATEGORY_OPTIONS,
  emptyMerchantForm,
  isMerchantFormComplete,
  submitMerchantForm,
  validateMerchantForm,
  type MerchantFormValues,
  type RequiredField,
} from "@/lib/merchant-form";

export function MerchantForm() {
  const [values, setValues] = useState<MerchantFormValues>(emptyMerchantForm);
  const [errors, setErrors] = useState<Partial<Record<RequiredField, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const complete = useMemo(() => isMerchantFormComplete(values), [values]);

  const update = <K extends keyof MerchantFormValues>(key: K, value: MerchantFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as RequiredField];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateMerchantForm(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    setSubmitting(true);
    try {
      await submitMerchantForm(values);
      setShowSuccess(true);
      setValues(emptyMerchantForm);
      setErrors({});
    } catch (err) {
      console.error(err);
      toast.error("ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <FormField label="ชื่อร้านค้า" htmlFor="storeName" required error={errors.storeName}>
          <Input
            id="storeName"
            value={values.storeName}
            onChange={(e) => update("storeName", e.target.value)}
            placeholder="เช่น PEEP Cafe"
            className={cn(errors.storeName && "border-destructive")}
          />
        </FormField>

        <FormField label="โลโก้ร้านค้า" htmlFor="logo" required error={errors.logo}>
          <SingleImageUpload
            id="logo"
            value={values.logo}
            onChange={(f) => update("logo", f)}
            invalid={!!errors.logo}
          />
        </FormField>

        <FormField
          label="Location ของร้าน"
          htmlFor="mapsLink"
          required
          hint="วางลิงก์ Google Maps ของร้าน"
          error={errors.mapsLink}
        >
          <Input
            id="mapsLink"
            type="url"
            inputMode="url"
            value={values.mapsLink}
            onChange={(e) => update("mapsLink", e.target.value)}
            placeholder="https://maps.google.com/..."
            className={cn(errors.mapsLink && "border-destructive")}
          />
        </FormField>

        <FormField label="เวลาเปิด-ปิดร้าน" htmlFor="openingHours" required error={errors.openingHours}>
          <Input
            id="openingHours"
            value={values.openingHours}
            onChange={(e) => update("openingHours", e.target.value)}
            placeholder="เช่น จันทร์-ศุกร์ 09:00-18:00"
            className={cn(errors.openingHours && "border-destructive")}
          />
        </FormField>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField label="ชื่อผู้ติดต่อ" htmlFor="contactName" required error={errors.contactName}>
            <Input
              id="contactName"
              value={values.contactName}
              onChange={(e) => update("contactName", e.target.value)}
              placeholder="ชื่อ-นามสกุล"
              className={cn(errors.contactName && "border-destructive")}
            />
          </FormField>

          <FormField label="เบอร์โทรผู้ติดต่อ" htmlFor="contactPhone" required error={errors.contactPhone}>
            <Input
              id="contactPhone"
              type="tel"
              inputMode="tel"
              value={values.contactPhone}
              onChange={(e) => update("contactPhone", e.target.value)}
              placeholder="08x-xxx-xxxx"
              className={cn(errors.contactPhone && "border-destructive")}
            />
          </FormField>
        </div>

        <FormField label="หมวดหมู่ร้านค้า" required error={errors.category}>
          <Select value={values.category} onValueChange={(v) => update("category", v)}>
            <SelectTrigger className={cn("w-full", errors.category && "border-destructive")}>
              <SelectValue placeholder="เลือกหมวดหมู่" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label="ช่องทางติดต่อร้าน"
          htmlFor="contactChannels"
          required
          hint="เช่น Facebook, Instagram, LINE OA, Website"
          error={errors.contactChannels}
        >
          <Textarea
            id="contactChannels"
            value={values.contactChannels}
            onChange={(e) => update("contactChannels", e.target.value)}
            placeholder={"Facebook: ...\nIG: @...\nLINE OA: @..."}
            rows={3}
            className={cn(errors.contactChannels && "border-destructive")}
          />
        </FormField>

        <FormField
          label="รายละเอียดคูปอง / โปรโมชัน"
          htmlFor="promotionDetails"
          required
          error={errors.promotionDetails}
        >
          <Textarea
            id="promotionDetails"
            value={values.promotionDetails}
            onChange={(e) => update("promotionDetails", e.target.value)}
            placeholder="อธิบายโปรโมชันหรือคูปองที่ต้องการให้ลูกค้าได้รับ"
            rows={4}
            className={cn(errors.promotionDetails && "border-destructive")}
          />
        </FormField>

        <FormField label="รายละเอียดร้านค้า" htmlFor="storeDescription" optional>
          <Textarea
            id="storeDescription"
            value={values.storeDescription}
            onChange={(e) => update("storeDescription", e.target.value)}
            placeholder="เล่าเรื่องราวหรือจุดเด่นของร้าน"
            rows={4}
          />
        </FormField>

        <FormField label="รูปภาพร้านหรือสินค้า" htmlFor="photos" optional hint="อัปโหลดได้หลายรูป">
          <MultiImageUpload
            id="photos"
            value={values.photos}
            onChange={(f) => update("photos", f)}
          />
        </FormField>

        <div
          className={cn(
            "flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4",
            errors.consent && "border-destructive/60",
          )}
        >
          <Checkbox
            id="consent"
            checked={values.consent}
            onCheckedChange={(c) => update("consent", c === true)}
            className="mt-0.5"
          />
          <label htmlFor="consent" className="text-sm leading-relaxed text-foreground">
            ยอมรับ
            <span className="font-medium text-brand"> เงื่อนไขการสมัครร้านค้า </span>
            และ
            <span className="font-medium text-brand"> นโยบายความเป็นส่วนตัว </span>
            ของ PEEP SHARE
            {errors.consent && (
              <span className="mt-1 block text-xs font-medium text-destructive">
                {errors.consent}
              </span>
            )}
          </label>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={!complete || submitting}
          className="w-full bg-gradient-brand text-base font-semibold text-primary-foreground shadow-card hover:opacity-95"
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin" /> กำลังส่งข้อมูล...
            </>
          ) : (
            <>
              <Send /> ส่งใบสมัครร้านค้า
            </>
          )}
        </Button>
      </form>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="text-center sm:max-w-sm">
          <DialogHeader className="items-center">
            <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-brand-soft">
              <svg viewBox="0 0 24 24" className="size-7 text-brand" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <DialogTitle className="text-xl">ส่งข้อมูลสำเร็จ</DialogTitle>
            <DialogDescription className="text-base">
              ทีมงาน PEEP SHARE จะตรวจสอบข้อมูลและติดต่อกลับเร็วๆ นี้
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowSuccess(false)} className="mt-2 bg-gradient-brand text-primary-foreground">
            เรียบร้อย
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
