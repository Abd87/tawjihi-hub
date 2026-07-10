import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // Supported locales (Arabic as default, English as toggle)
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  localeDetection: true,
});

// Navigation utilities wrapped with the routing locales
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
