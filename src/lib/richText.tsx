import React from 'react';

/**
 * Safely parses inline emphasis without dangerouslySetInnerHTML.
 * Supports:
 * - <em>...</em> or *...* -> <em> tag
 * - <strong>...</strong> or **...** -> <strong> tag
 * - <br/> or \n -> <br/>
 * Leaves all other tags as plain escaped text.
 */
export function renderRichText(text: string | undefined | null): React.ReactNode {
  if (!text) return null;

  // Split text by recognized safe markup tags
  const tokens = text.split(/(<em>.*?<\/em>|<strong>.*?<\/strong>|<br\s*\/?>|\n)/gi);

  return (
    <>
      {tokens.map((token, index) => {
        if (!token) return null;

        // Match <em>...</em>
        const emMatch = token.match(/^<em>(.*?)<\/em>$/i);
        if (emMatch) {
          return (
            <em key={index} className="font-serif italic font-normal text-inherit">
              {emMatch[1]}
            </em>
          );
        }

        // Match <strong>...</strong>
        const strongMatch = token.match(/^<strong>(.*?)<\/strong>$/i);
        if (strongMatch) {
          return (
            <strong key={index} className="font-semibold text-inherit">
              {strongMatch[1]}
            </strong>
          );
        }

        // Match line break
        if (/^<br\s*\/?>$/i.test(token) || token === '\n') {
          return <br key={index} />;
        }

        return <React.Fragment key={index}>{token}</React.Fragment>;
      })}
    </>
  );
}

/**
 * Strips formatting for plain text use (e.g. meta tags, titles).
 */
export function stripRichText(text: string | undefined | null): string {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
