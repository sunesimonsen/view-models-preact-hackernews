import { useContext } from "preact/hooks";
import { HackerNewsContext } from "../context/HackerNewsContext";
import { useModelState } from "@view-models/preact";

export const useStory = (id: string) => {
  const hackerNews = useContext(HackerNewsContext);

  const model = hackerNews.getStory(id);
  return useModelState(model);
};
