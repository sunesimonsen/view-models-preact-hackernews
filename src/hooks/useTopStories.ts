import { useContext } from "preact/hooks";
import { HackerNewsContext } from "../context/HackerNewsContext";
import { useModelState } from "@view-models/preact";

export const useTopStories = () => {
  const hackerNews = useContext(HackerNewsContext);

  const model = hackerNews.topStories;
  const state = useModelState(model);
  return { ...state, reload: model.reload, loadMore: model.loadMore };
};
