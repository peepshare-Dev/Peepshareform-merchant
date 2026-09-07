import { createFileRoute } from "@tanstack/react-router";
import { Check, Gift, Megaphone, Palette, SlidersHorizontal } from "lucide-react";

import { MerchantForm } from "@/components/merchant/MerchantForm";

export const Route = createFileRoute("/")({
  component: Index,
});

const BENEFITS = [
  { icon: Gift, text: "พื้นที่โปรโมชันในแอปโดยไม่มีค่าใช้จ่าย" },
  { icon: Palette, text: "การสนับสนุนด้านคอนเทนต์ดีไซน์จากทีม JTS" },
  { icon: Megaphone, text: "การโปรโมทภายในแอปเพื่อเข้าถึงผู้ใช้งาน" },
  { icon: SlidersHorizontal, text: "ร้านค้าสามารถกำหนดเงื่อนไขโปรโมชันได้เอง" },
];

function Index() {
  return (
    <div className="aurora-background min-h-screen">
      <div className="mx-auto w-full max-w-[860px] px-4 py-10 sm:px-6 sm:py-14">
        {/* Header */}
        <header className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-sm font-semibold text-brand">
            <span className="size-2 rounded-full bg-brand" />
            PEEP SHARE
          </span>
          <h1 className="mt-5 text-2xl font-bold leading-snug text-foreground sm:text-3xl">
            แบบฟอร์มสมัครร้านค้ากับ PEEP SHARE
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            ลงทะเบียนร้านค้าเพื่อเข้าร่วมโปรโมชันและแสดงร้านค้าบนแอป PEEP SHARE
          </p>
        </header>

        {/* Info card */}
        <section className="mt-8 rounded-2xl border border-border bg-card/95 p-6 shadow-card backdrop-blur-sm sm:p-7">
          <h2 className="text-base font-semibold text-foreground">
            ร้านค้าที่ลงทะเบียนกับ PEEP SHARE จะได้รับ:
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {BENEFITS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                  <Icon className="size-4" />
                </span>
                <span className="text-sm text-foreground">{text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Form card */}
        <main className="mt-6 rounded-2xl border border-border bg-card/95 p-6 shadow-card backdrop-blur-sm sm:p-8">
          <div className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Check className="size-4 text-brand" />
            ช่องที่มีเครื่องหมาย <span className="text-destructive">*</span> จำเป็นต้องกรอก
          </div>
          <MerchantForm />
        </main>

        <footer className="mt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} PEEP SHARE · JTS Team
        </footer>
      </div>
    </div>
  );
}
