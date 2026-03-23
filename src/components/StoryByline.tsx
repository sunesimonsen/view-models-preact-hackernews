import { memo } from "preact/compat";
import type { Story } from "../types/Story";
import { formatRelativeHours } from "../utils/time";
import { CommentsLink } from "./CommentsLink";

interface StoryBylineProps {
  story: Story;
  showCommentLink: boolean;
}

export const StoryByline = memo(
  ({ story, showCommentLink }: StoryBylineProps) => {
    return (
      <div className="story-byline">
        <span>
          {story.score} points by {story.by}
        </span>
        <span>{formatRelativeHours(story.time)}</span>
        {showCommentLink && <CommentsLink story={story} />}
      </div>
    );
  },
);
