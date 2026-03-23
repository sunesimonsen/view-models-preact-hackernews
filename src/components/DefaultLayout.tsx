import { memo } from "preact/compat";
import type { ComponentChildren } from "preact";
import { TopBar } from "./TopBar";

type Props = {
  children: ComponentChildren;
};

export const DefaultLayout = memo(({ children }: Props) => {
  return (
    <main>
      <TopBar />
      <section className="content">{children}</section>
    </main>
  );
});
