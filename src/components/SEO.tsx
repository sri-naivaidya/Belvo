import { useEffect } from "react";

const SITE_NAME = "Belvo";
const DEFAULT_DESC = "Belvo is a high-end creative agency that builds brands from scratch. We help ideas come into reality and scale your business globally.";
const DEFAULT_OG_IMAGE = "/opengraph.jpg";
const SITE_URL = "https://belvo.agency";

interface SEOProps {
  title: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  path?: string;
}

export default function SEO({ title, description = DEFAULT_DESC, ogImage = DEFAULT_OG_IMAGE, ogType = "website", path = "/" }: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} — ${SITE_NAME}`;
    const url = `${SITE_URL}${path}`;
    const ogImg = `${SITE_URL}${ogImage}`;

    document.title = fullTitle;

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:url", url, true);
    setMeta("og:image", ogImg, true);
    setMeta("og:type", ogType, true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImg);

    const link = document.querySelector('link[rel="canonical"]') || document.createElement("link");
    link.setAttribute("rel", "canonical");
    link.setAttribute("href", url);
    if (!link.parentNode) document.head.appendChild(link);
  }, [title, description, ogImage, ogType, path]);

  return null;
}
