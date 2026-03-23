import { memo, forwardRef } from "preact/compat";
import type { ComponentChildren } from "preact";
import { Skeleton } from "./Skeleton";

interface StoryTitleProps {
  children: ComponentChildren;
}

export const StoryTitle = memo(({ children }: StoryTitleProps) => {
  return <div className="story-title">{children}</div>;
});

interface StoryCardProps {
  children: ComponentChildren;
}

export const StoryCard = memo(
  forwardRef<HTMLLIElement, StoryCardProps>(({ children }, ref) => {
    return (
      <li className="story-card" ref={ref}>
        {children}
      </li>
    );
  }),
);

export const StoryPlaceholder = memo(() => {
  return (
    <StoryCard>
      <StoryTitle>
        <Skeleton />
      </StoryTitle>
      <div>
        <Skeleton />
      </div>
    </StoryCard>
  );
});
