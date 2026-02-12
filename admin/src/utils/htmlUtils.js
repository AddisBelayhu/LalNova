export const stripHtmlTags = (html) => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

export const getPreviewText = (html, maxLength = 100) => {
  const plainText = stripHtmlTags(html);
  return plainText.length > maxLength
    ? plainText.substring(0, maxLength) + '...'
    : plainText;
};

export const sanitizeHtml = (html) => {
  if (!html) return '';
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};
