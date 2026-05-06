"use client";

import { Cairo } from "next/font/google";
import { JsonValue } from "@/lib/section-registry";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";

const cairo = Cairo({ subsets: ["arabic"] });

interface ContactSectionProps {
  data: Record<string, JsonValue>;
}

export function ContactSection({ data }: ContactSectionProps) {
  const title = (data.title as string) || "ابق على تواصل";

  return (
    <section className={`py-24 bg-gray-50 ${cairo.className}`} dir="rtl">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">{title}</h2>
            <p className="text-gray-600 mb-10 leading-relaxed">نحن هنا للإجابة على جميع استفساراتك. لا تتردد في التواصل معنا في أي وقت.</p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-accent">
                  <EnvelopeIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">البريد الإلكتروني</div>
                  <div className="font-bold text-gray-900">contact@example.com</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-accent">
                  <PhoneIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">رقم الهاتف</div>
                  <div className="font-bold text-gray-900">+966 50 000 0000</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-gray-200/50">
            <form className="space-y-4">
              <input type="text" placeholder="الاسم الكامل" className="w-full px-6 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-accent/20 transition-all" />
              <input type="email" placeholder="البريد الإلكتروني" className="w-full px-6 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-accent/20 transition-all" />
              <textarea placeholder="رسالتك" rows={4} className="w-full px-6 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-accent/20 transition-all"></textarea>
              <button type="button" className="w-full py-4 bg-accent text-white font-black rounded-xl hover:bg-accent-hover transition-all">إرسال الرسالة</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
