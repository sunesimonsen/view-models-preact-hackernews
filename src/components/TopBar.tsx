import { memo } from "preact/compat";
import { HomeLink } from "./HomeLink";
import { ReloadButton } from "./ReloadButton";
import { useRouteName } from "@nano-router/preact";

export const TopBar = memo(() => {
  const route = useRouteName();

  return (
    <header>
      <HomeLink />
      {route === "home" && <ReloadButton />}
    </header>
  );
});
