type AnalyticsValue = string | number | boolean;
type AnalyticsProperties = Record<string, AnalyticsValue | null | undefined>;

export type PortfolioEvent =
  | 'assistant_open'
  | 'assistant_question'
  | 'assistant_navigation'
  | 'contact_attempt'
  | 'contact_failure'
  | 'contact_success'
  | 'email_copy'
  | 'external_profile_click'
  | 'project_mode_change'
  | 'project_open'
  | 'project_share'
  | 'project_source_click'
  | 'project_demo_click'
  | 'resume_open'
  | 'tour_complete'
  | 'tour_start'
  | 'tour_stop';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
let initialized = false;

function cleanProperties(properties: AnalyticsProperties) {
  return Object.fromEntries(
    Object.entries(properties)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [
        key,
        typeof value === 'string' ? value.slice(0, 100) : value,
      ]),
  ) as Record<string, AnalyticsValue>;
}

export function initializeAnalytics() {
  if (initialized || !measurementId || typeof document === 'undefined') return;
  initialized = true;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    send_page_view: false,
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.dataset.portfolioAnalytics = 'true';
  document.head.appendChild(script);
}

export function trackPageView(page: string, path = window.location.pathname) {
  const detail = cleanProperties({ page, path });

  window.dispatchEvent(new CustomEvent('portfolio:pageview', { detail }));
  window.gtag?.('event', 'page_view', {
    page_title: page,
    page_path: path,
  });
}

export function trackEvent(name: PortfolioEvent, properties: AnalyticsProperties = {}) {
  const detail = cleanProperties(properties);

  window.dispatchEvent(new CustomEvent('portfolio:analytics', { detail: { name, ...detail } }));
  window.gtag?.('event', name, detail);
}
