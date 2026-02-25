import { bubbleSort, selectionSort, insertionSort, quickSort, mergeSort } from "./sorting";
import { linearSearch, binarySearch } from "./searching";
import { bfs, dfs } from "./graph";

export const sortingAlgorithms = {
  "bubble-sort": bubbleSort,
  "selection-sort": selectionSort,
  "insertion-sort": insertionSort,
  "quick-sort": quickSort,
  "merge-sort": mergeSort,
};

export const searchingAlgorithms = {
  "linear-search": linearSearch,
  "binary-search": binarySearch,
};

export const graphAlgorithms = {
  "bfs": bfs,
  "dfs": dfs,
};

export type AlgorithmType = "sorting" | "searching" | "graph";