"use client";
import { memo, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { JsonValue } from "@/lib/section-registry";
import { motion, AnimatePresence } from "framer-motion";

interface FAQSectionProps {
  data: Record<string, JsonValue>;
}

export const FAQSection = memo(function FAQSection({ data }: FAQSectionProps) {
  const title = (data.title as string) || "الأسئلة الشائعة";
  const faqs = (data.faqs as { q: string; a: string }[]) || [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-6 bg-background" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl @md:text-4xl font-bold text-foreground mb-4">{title}</h2>
          <div className="w-20 h-1.5 bg-accent mx-auto rounded-full" />
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-border-color rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-right bg-background hover:bg-muted transition-colors group"
                >
                  <span className="font-bold text-foreground">{faq.q}</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-muted-foreground group-hover:text-accent transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="p-6 pt-0 text-muted-foreground border-t border-border-color bg-muted/30">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});
