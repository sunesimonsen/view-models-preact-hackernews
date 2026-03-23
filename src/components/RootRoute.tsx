import { useRouteName } from "@nano-router/preact";
import { StoriesRoute } from "./StoriesRoute";
import { CommentRoute } from "./CommentRoute";

export const RootRoute = () => {
  const route = useRouteName();

  switch (route) {
    case "comment":
      return <CommentRoute />;
    default:
      return <StoriesRoute />;
  }
};
