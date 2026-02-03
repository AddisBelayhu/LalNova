// Utility functions for handling HTML content

// Strip HTML tags and get plain text for previews
export const stripHtmlTags = (html) => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

// Get truncated plain text for previews
export const getPreviewText = (html, maxLength = 100) => {
  const plainText = stripHtmlTags(html);
  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength) + '...'
    : plainText;
};

// Sanitize HTML content (basic sanitization)
export const sanitizeHtml = (html) => {
  if (!html) return '';
  // Remove script tags and other potentially dangerous elements
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};