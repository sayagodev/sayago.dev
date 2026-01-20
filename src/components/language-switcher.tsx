"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/utils/i18n-navigation";
import { locales, type Locale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex gap-2">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={
            locale === loc
              ? "bg-success _red:bg-info text-success-content"
              : "bg-secondary/70 text-secondary-content"
          }
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
