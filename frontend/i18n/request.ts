import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  
  // Guard against invalid/malformed locales in dev mode requests
  if (!locale || !['ar', 'en'].includes(locale)) {
    locale = 'ar';
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
