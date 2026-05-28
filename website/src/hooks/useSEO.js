import { useEffect } from 'react';

/**
 * Hook to dynamically update the page <title> and meta description for each route.
 * This improves SEO for single-page applications by ensuring crawlers and
 * browser tabs reflect the current page context.
 *
 * @param {string} title - The page-specific title (appended with site name).
 * @param {string} description - The page-specific meta description.
 */
export function useSEO(title, description) {
  useEffect(() => {
    const siteName = 'moz-utils';
    const fullTitle = title ? `${title} — ${siteName}` : `${siteName} — Mozambique Utilities for Developers`;

    document.title = fullTitle;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && description) {
      metaDesc.setAttribute('content', description);
    }

    // Update Open Graph title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', fullTitle);
    }

    // Update Open Graph description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && description) {
      ogDesc.setAttribute('content', description);
    }

    // Update Twitter title
    let twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) {
      twTitle.setAttribute('content', fullTitle);
    }

    // Update Twitter description
    let twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc && description) {
      twDesc.setAttribute('content', description);
    }

    // Reset on unmount to base values
    return () => {
      document.title = `${siteName} — Mozambique Utilities for Developers`;
    };
  }, [title, description]);
}
