import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("algorithms").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("algorithms")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("algorithms").first();
    if (existing) return;

    const algorithms = [
      {
        slug: "bubble-sort",
        name: "Bubble Sort",
        category: "sorting",
        description: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
        complexity: { time: "O(n²)", space: "O(1)" },
      },
      {
        slug: "selection-sort",
        name: "Selection Sort",
        category: "sorting",
        description: "Sorts an array by repeatedly finding the minimum element from unsorted part and putting it at the beginning.",
        complexity: { time: "O(n²)", space: "O(1)" },
      },
      {
        slug: "insertion-sort",
        name: "Insertion Sort",
        category: "sorting",
        description: "Builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms.",
        complexity: { time: "O(n²)", space: "O(1)" },
      },
      {
        slug: "quick-sort",
        name: "Quick Sort",
        category: "sorting",
        description: "A divide-and-conquer algorithm. It works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays.",
        complexity: { time: "O(n log n)", space: "O(log n)" },
      },
      {
        slug: "merge-sort",
        name: "Merge Sort",
        category: "sorting",
        description: "A divide-and-conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.",
        complexity: { time: "O(n log n)", space: "O(n)" },
      },
      {
        slug: "linear-search",
        name: "Linear Search",
        category: "searching",
        description: "Sequentially checks each element of the list until a match is found or the whole list has been searched.",
        complexity: { time: "O(n)", space: "O(1)" },
      },
      {
        slug: "binary-search",
        name: "Binary Search",
        category: "searching",
        description: "Search a sorted array by repeatedly dividing the search interval in half.",
        complexity: { time: "O(log n)", space: "O(1)" },
      },
      {
        slug: "bfs",
        name: "Breadth First Search",
        category: "graph",
        description: "Traverses a graph level by level, visiting all neighbors of a node before moving to the next level.",
        complexity: { time: "O(V + E)", space: "O(V)" },
      },
      {
        slug: "dfs",
        name: "Depth First Search",
        category: "graph",
        description: "Traverses a graph by exploring as far as possible along each branch before backtracking.",
        complexity: { time: "O(V + E)", space: "O(V)" },
      },
    ];

    for (const algo of algorithms) {
      await ctx.db.insert("algorithms", algo as any);
    }
  },
});