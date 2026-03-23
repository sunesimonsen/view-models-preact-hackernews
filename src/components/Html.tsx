import { memo } from "preact/compat";

interface HtmlProps {
  html: string;
}

export const Html = memo(({ html }: HtmlProps) => {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
});
