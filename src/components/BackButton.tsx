import { memo } from "preact/compat";
import { useCallback } from "preact/hooks";
import { useRouter } from "@nano-router/preact";

export const BackButton = memo(() => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <button className="back-button" onClick={handleClick}>
      X
    </button>
  );
});

BackButton.displayName = "BackButton";
