"use client";

import { Cairo } from "next/font/google";

const cairo = Cairo({ subsets: ["arabic"] });

interface FooterSectionProps {
  data: any;
}

export function FooterSection({ data }: FooterSectionProps) {
  return (
    <footer className={`py-12 px-6 bg-gray-900 text-white ${cairo.className}`} dir="rtl">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h3 className="text-2xl font-black mb-2">رِكاز</h3>
          <p className="text-gray-400">بناء المستقبل، خطوة بخطوة.</p>
        </div>
        
        <div className="flex gap-8 text-gray-400">
          <a href="#" className="hover:text-accent transition-colors">الرئيسية</a>
          <a href="#" className="hover:text-accent transition-colors">المميزات</a>
          <a href="#" className="hover:text-accent transition-colors">اتصل بنا</a>
        </div>

        <div className="text-gray-500 text-sm">
          {data.copyright || "© 2026 جميع الحقوق محفوظة."}
        </div>
      </div>
    </footer>
  );
}
