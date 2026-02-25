export type SortStep = {
  type: "compare" | "swap" | "overwrite" | "sorted";
  indices: number[];
  array: number[];
  description?: string;
};

export function* bubbleSort(array: number[]): Generator<SortStep> {
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { type: "compare", indices: [j, j + 1], array: [...arr], description: `Comparing ${arr[j]} and ${arr[j + 1]}` };
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield { type: "swap", indices: [j, j + 1], array: [...arr], description: `Swapping ${arr[j + 1]} and ${arr[j]}` };
      }
    }
    yield { type: "sorted", indices: [n - i - 1], array: [...arr], description: `${arr[n - i - 1]} is sorted` };
  }
  yield { type: "sorted", indices: [0], array: [...arr], description: "Array is sorted" };
}

export function* selectionSort(array: number[]): Generator<SortStep> {
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield { type: "compare", indices: [minIdx, j], array: [...arr], description: `Comparing current minimum ${arr[minIdx]} with ${arr[j]}` };
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      yield { type: "swap", indices: [i, minIdx], array: [...arr], description: `Swapping new minimum ${arr[i]} to position ${i}` };
    }
    yield { type: "sorted", indices: [i], array: [...arr], description: `${arr[i]} is sorted` };
  }
}

export function* insertionSort(array: number[]): Generator<SortStep> {
  const arr = [...array];
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    yield { type: "compare", indices: [i], array: [...arr], description: `Selected ${key} to insert` };

    while (j >= 0 && arr[j] > key) {
      yield { type: "compare", indices: [j, j + 1], array: [...arr], description: `Comparing ${arr[j]} with ${key}` };
      arr[j + 1] = arr[j];
      yield { type: "overwrite", indices: [j + 1], array: [...arr], description: `Moving ${arr[j]} forward` };
      j = j - 1;
    }
    arr[j + 1] = key;
    yield { type: "overwrite", indices: [j + 1], array: [...arr], description: `Inserted ${key} at position ${j + 1}` };
  }
  // Mark all as sorted at the end
  for (let i = 0; i < n; i++) yield { type: "sorted", indices: [i], array: [...arr] };
}

export function* quickSort(array: number[]): Generator<SortStep> {
  const arr = [...array];
  yield* quickSortHelper(arr, 0, arr.length - 1);
  // Mark all as sorted
  for (let i = 0; i < arr.length; i++) yield { type: "sorted", indices: [i], array: [...arr] };
}

function* quickSortHelper(arr: number[], low: number, high: number): Generator<SortStep> {
  if (low < high) {
    const piIndex = yield* partition(arr, low, high);
    yield* quickSortHelper(arr, low, piIndex - 1);
    yield* quickSortHelper(arr, piIndex + 1, high);
  }
}

function* partition(arr: number[], low: number, high: number): Generator<SortStep> {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    yield { type: "compare", indices: [j, high], array: [...arr], description: `Comparing ${arr[j]} with pivot ${pivot}` };
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      yield { type: "swap", indices: [i, j], array: [...arr], description: `Swapping ${arr[i]} and ${arr[j]}` };
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  yield { type: "swap", indices: [i + 1, high], array: [...arr], description: `Placing pivot ${pivot} at correct position` };
  return i + 1;
}

export function* mergeSort(array: number[]): Generator<SortStep> {
  let arr = [...array];
  yield* mergeSortHelper(arr, 0, arr.length - 1);
  for (let i = 0; i < arr.length; i++) yield { type: "sorted", indices: [i], array: [...arr] };
}

function* mergeSortHelper(arr: number[], l: number, r: number): Generator<SortStep> {
  if (l >= r) return;
  let m = l + Math.floor((r - l) / 2);
  yield* mergeSortHelper(arr, l, m);
  yield* mergeSortHelper(arr, m + 1, r);
  yield* merge(arr, l, m, r);
}

function* merge(arr: number[], l: number, m: number, r: number): Generator<SortStep> {
  let n1 = m - l + 1;
  let n2 = r - m;
  let L = new Array(n1);
  let R = new Array(n2);

  for (let i = 0; i < n1; i++) L[i] = arr[l + i];
  for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

  let i = 0, j = 0, k = l;

  while (i < n1 && j < n2) {
    yield { type: "compare", indices: [l + i, m + 1 + j], array: [...arr], description: `Comparing ${L[i]} and ${R[j]}` };
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      yield { type: "overwrite", indices: [k], array: [...arr], description: `Taking ${L[i]} from left subarray` };
      i++;
    } else {
      arr[k] = R[j];
      yield { type: "overwrite", indices: [k], array: [...arr], description: `Taking ${R[j]} from right subarray` };
      j++;
    }
    k++;
  }

  while (i < n1) {
    arr[k] = L[i];
    yield { type: "overwrite", indices: [k], array: [...arr], description: `Taking remaining ${L[i]} from left` };
    i++;
    k++;
  }

  while (j < n2) {
    arr[k] = R[j];
    yield { type: "overwrite", indices: [k], array: [...arr], description: `Taking remaining ${R[j]} from right` };
    j++;
    k++;
  }
}
