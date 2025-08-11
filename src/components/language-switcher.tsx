'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { locales, type Locale } from '@/i18n/config';
import { Languages, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Derive active locale robustly with pathname fallback (as-needed strategy)
  const isZhFromPath = pathname?.startsWith('/zh');
  const activeLocale = (isZhFromPath ? 'zh' : locale) as Locale;

  const closeMenu = () => {
    if (menuRef.current && document.activeElement && menuRef.current.contains(document.activeElement)) {
      triggerRef.current?.focus();
    }
    setIsOpen(false);
  };

  const switchLanguage = (newLocale: Locale) => {
    // Remove current locale prefix if exists (handles /zh or /en)
    const pathnameWithoutLocale = pathname.replace(/^\/(zh|en)(?=\/|$)/, '') || '/';

    // as-needed: en no prefix, zh with /zh. Do not prepend basePath manually.
    const localePrefix = newLocale === 'en' ? '' : '/zh';
    const newPath = `${localePrefix}${pathnameWithoutLocale === '/' ? '' : pathnameWithoutLocale}`;
    
    router.push(newPath as any);
    closeMenu();
  };

  // Manage inert to prevent focus when closed and avoid aria-hidden issues
  useEffect(() => {
    if (!menuRef.current) return;
    if (!isOpen) {
      menuRef.current.setAttribute('inert', '');
    } else {
      menuRef.current.removeAttribute('inert');
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-background/60 backdrop-blur-sm border-border/30 hover:bg-background/80 w-9 h-9 group ${
          isOpen ? 'ring-2 ring-primary/40' : ''
        }`}
        aria-label="Change language"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="lang-menu"
      >
        <span className="relative inline-flex items-center justify-center">
          <Languages className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
          {/* <span
            className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-1 ring-background transition-colors ${
              activeLocale === 'zh' ? 'bg-amber-500' : 'bg-blue-500'
            }`}
            aria-hidden
          /> */}
        </span>
      </Button>

      <div
        className={`absolute top-full mt-2 right-0 origin-top-right bg-background/90 backdrop-blur-lg border border-border/30 rounded-lg shadow-lg overflow-hidden z-50 transform transition-all duration-200 ease-out ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
        }`}
        id="lang-menu"
        role="menu"
        ref={menuRef}
      >
        {locales.map((localeOption, index) => {
          const isActive = activeLocale === localeOption;
          return (
            <button
              key={localeOption}
              onClick={() => switchLanguage(localeOption)}
              className={`
                w-full px-3 py-2 text-left transition-colors text-sm flex items-center gap-2
                ${isActive ? 'bg-muted/30 text-primary' : 'text-foreground hover:bg-muted/50'}
              `}
              style={{ transitionDelay: isOpen ? `${index * 30}ms` : '0ms' }}
              role="menuitemradio"
              aria-checked={isActive}
            >
              <span
                className={`inline-flex items-center justify-center transition-all ${
                  isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                }`}
              >
                {isActive && <Check className="h-3.5 w-3.5" />}
              </span>
              <span
                className={`transition-all ${
                  isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                }`}
              >
                {localeOption.toUpperCase()}
              </span>
            </button>
          );
        })}
      </div>

      {isOpen && (
        <button
          aria-label="Close language menu"
          className="fixed inset-0 z-40"
          onClick={closeMenu}
        />
      )}
    </div>
  );
}
