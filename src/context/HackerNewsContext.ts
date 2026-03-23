import { createContext } from "preact";
import { HackerNewsModel } from "../state/HackerNewsModel";
import { HackerNewsApi } from "../api/HackerNewsApi";

export const HackerNewsContext = createContext(
  new HackerNewsModel(new HackerNewsApi()),
);
