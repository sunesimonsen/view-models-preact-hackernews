import { memo } from "preact/compat";
import type { ComponentChildren } from "preact";
import { useLink } from "@nano-router/preact";

interface LinkButtonProps {
  children: ComponentChildren;
  route: string;
  params?: Record<string, string>;
}

export const LinkButton = memo(({ children, route, params }: LinkButtonProps) => {
  const linkProps = useLink({ route, params });

  return (
    <a className="link-button" {...linkProps}>
      {children}
    </a>
  );
});

LinkButton.displayName = "LinkButton";
