/**
 * Minimal, dependency-free HTML sanitiser for rich-text post content.
 *
 * Content is authored only by authenticated admins, so this is a defence-in-
 * depth measure rather than the primary trust boundary. It strips anything
 * that could execute script when the HTML is later rendered with
 * dangerouslySetInnerHTML on the public blog pages:
 *   - <script>, <style>, <iframe>, <object>, <embed> elements (and contents)
 *   - on* event-handler attributes (onclick, onerror, …)
 *   - javascript:/data:/vbscript: URLs in href/src
 *
 * It deliberately keeps the formatting tags the editor emits (headings,
 * paragraphs, lists, links, images, blockquote, bold/italic, etc.).
 */

const BLOCKED_ELEMENTS = /<\s*(script|style|iframe|object|embed|form|link|meta|base)\b[\s\S]*?(<\/\s*\1\s*>|$)/gi;
const SELF_CLOSING_BLOCKED = /<\s*(script|style|iframe|object|embed|form|link|meta|base)\b[^>]*\/?\s*>/gi;
const EVENT_HANDLERS = /\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const DANGEROUS_URL = /\s(href|src)\s*=\s*(["']?)\s*(javascript|data|vbscript):[^"'>\s]*\2/gi;

export function sanitizeHtml(input: string): string {
  if (!input) return "";
  let html = input;
  html = html.replace(BLOCKED_ELEMENTS, "");
  html = html.replace(SELF_CLOSING_BLOCKED, "");
  html = html.replace(EVENT_HANDLERS, "");
  // Drop dangerous URL schemes but keep the attribute harmless.
  html = html.replace(DANGEROUS_URL, ' $1="#"');
  return html.trim();
}

/** Strip every tag to recover plain text (excerpts, reading-time, word counts). */
export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** Estimate reading time in whole minutes at ~200 wpm (min 1). */
export function readingMinutes(html: string): number {
  const words = htmlToText(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
