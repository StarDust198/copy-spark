import { queryOptions } from "@tanstack/react-query";
import { getGenerations } from "../actions/generations";

export const generationOptions = () =>
  queryOptions({
    queryKey: ["chats"],
    queryFn: getGenerations,
  });
