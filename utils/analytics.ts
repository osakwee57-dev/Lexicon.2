// Simple wrapper for Vercel Analytics tracking
export const trackEvent = (name: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va('event', { name, data });
  }
  console.log(`[Analytics] Event: ${name}`, data);
};

export const trackPageView = (section: string) => {
  trackEvent('page_view', { section });
};