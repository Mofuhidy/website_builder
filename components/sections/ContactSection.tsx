"use client";

import { memo } from "react";
import { Cairo } from "next/font/google";
import { JsonValue } from "@/lib/section-registry";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

const cairo = Cairo({ subsets: ["arabic"] });

interface ContactSectionProps {
  data: Record<string, JsonValue>;
}

export const ContactSection = memo(function ContactSection({ data }: ContactSectionProps) {
  const title = (data.title as string) || "ابق على تواصل";
  const subtitle = (data.subtitle as string) || "نحن هنا للإجابة على جميع استفساراتك.";
  const email = (data.email as string) || "contact@example.com";
  const phone = (data.phone as string) || "+966 50 000 0000";
  const buttonText = (data.buttonText as string) || "إرسال الرسالة";

  return (
    <section className={`py-24 bg-muted ${cairo.className}`} dir="rtl">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 @md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-black text-foreground mb-6">{title}</h2>
            <p className="text-muted-foreground mb-10 leading-relaxed">{subtitle}</p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-background rounded-xl shadow-sm flex items-center justify-center text-accent">
                  <EnvelopeIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">البريد الإلكتروني</div>
                  <div className="font-bold text-foreground">{email}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-background rounded-xl shadow-sm flex items-center justify-center text-accent">
                  <PhoneIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">رقم الهاتف</div>
                  <div className="font-bold text-foreground">{phone}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background p-10 rounded-[2rem] shadow-xl shadow-gray-200/50">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="الاسم الكامل"
                className="w-full px-6 py-4 bg-muted border-none rounded-xl focus:ring-2 focus:ring-accent/20 transition-all text-foreground"
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                className="w-full px-6 py-4 bg-muted border-none rounded-xl focus:ring-2 focus:ring-accent/20 transition-all text-foreground"
              />
              <textarea
                placeholder="رسالتك"
                rows={4}
                className="w-full px-6 py-4 bg-muted border-none rounded-xl focus:ring-2 focus:ring-accent/20 transition-all text-foreground"
              />
              <button
                type="button"
                className="w-full py-4 bg-accent text-white font-black rounded-xl hover:bg-accent-hover transition-all"
              >
                {buttonText}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
});
