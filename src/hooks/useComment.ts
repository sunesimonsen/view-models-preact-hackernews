import { useContext } from "preact/hooks";
import { HackerNewsContext } from "../context/HackerNewsContext";
import { useModelState } from "@view-models/preact";

export const useComment = (id: string) => {
  const hackerNews = useContext(HackerNewsContext);

  const model = hackerNews.getComment(id);
  return useModelState(model);
};
