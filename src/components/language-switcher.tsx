'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { locales, type Locale } from '@/i18n/config';
import { Languages } from 'lucide-react';
import { useState } from 'react';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const [isOpen, setIsOpen] = useState(false);

  const switchLanguage = (newLocale: Locale) => {
    // Remove current locale prefix if exists (handles /zh or /en)
    const pathnameWithoutLocale = pathname.replace(/^\/(zh|en)(?=\/|$)/, '') || '/';

    // as-needed: en no prefix, zh with /zh. Do not prepend basePath manually.
    const localePrefix = newLocale === 'en' ? '' : '/zh';
    const newPath = `${localePrefix}${pathnameWithoutLocale === '/' ? '' : pathnameWithoutLocale}`;
    
    router.push(newPath as any);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-background/60 backdrop-blur-sm border-border/30 hover:bg-background/80 w-9 h-9"
        aria-label="Change language"
      >
        <Languages className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-background/90 backdrop-blur-lg border border-border/30 rounded-lg shadow-lg overflow-hidden z-50">
          {locales.map((localeOption) => (
            <button
              key={localeOption}
              onClick={() => switchLanguage(localeOption)}
              className={`
                w-full px-3 py-2 text-left hover:bg-muted/50 transition-colors text-sm
                ${locale === localeOption ? 'bg-muted/30 text-primary' : 'text-foreground'}
              `}
            >
              {localeOption.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
