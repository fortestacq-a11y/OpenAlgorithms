export type SearchStep = {
  type: "compare" | "found" | "not-found";
  indices: number[];
  description?: string;
};

export function* linearSearch(array: number[], target: number): Generator<SearchStep> {
  for (let i = 0; i < array.length; i++) {
    yield { type: "compare", indices: [i], description: `Checking index ${i}: Is ${array[i]} == ${target}?` };
    if (array[i] === target) {
      yield { type: "found", indices: [i], description: `Found ${target} at index ${i}!` };
      return;
    }
  }
  yield { type: "not-found", indices: [], description: `${target} not found in the array.` };
}

export function* binarySearch(array: number[], target: number): Generator<SearchStep> {
  // Note: Binary search requires a sorted array. We assume the input is sorted for visualization purposes
  // or we sort it first (but that changes indices). Usually visualization assumes sorted input.
  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    yield { type: "compare", indices: [mid, left, right], description: `Checking middle index ${mid} (value: ${array[mid]}). Range: [${left}, ${right}]` };

    if (array[mid] === target) {
      yield { type: "found", indices: [mid], description: `Found ${target} at index ${mid}!` };
      return;
    }

    if (array[mid] < target) {
      left = mid + 1;
      yield { type: "compare", indices: [mid], description: `${array[mid]} < ${target}, searching right half.` };
    } else {
      right = mid - 1;
      yield { type: "compare", indices: [mid], description: `${array[mid]} > ${target}, searching left half.` };
    }
  }
  yield { type: "not-found", indices: [], description: `${target} not found.` };
}
