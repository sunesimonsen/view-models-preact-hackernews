import { DefaultLayout } from "./DefaultLayout";
import { CommentAndAnswers } from "./CommentAndAnswers";
import { useParams } from "@nano-router/preact";

export const CommentRoute = () => {
  const { id } = useParams();

  return (
    <DefaultLayout>
      <CommentAndAnswers id={id} />
    </DefaultLayout>
  );
};
