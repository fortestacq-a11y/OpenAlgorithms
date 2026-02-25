export const codeSnippets = {
    "bubble-sort": (data: any) => ({
        c: `#include <stdio.h>

void bubbleSort(int arr[], int n) {
    int i, j;
    for (i = 0; i < n - 1; i++) {
        for (j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

int main() {
    int arr[] = {${data.array ? data.array.join(", ") : "10, 20, 5, 3"}};
    int n = sizeof(arr)/sizeof(arr[0]);
    bubbleSort(arr, n);
    printf("Sorted array: \\n");
    for (int i=0; i < n; i++)
        printf("%d ", arr[i]);
    return 0;
}`,
        java: `import java.util.Arrays;

class BubbleSort {
    void bubbleSort(int arr[]) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++)
            for (int j = 0; j < n - i - 1; j++)
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
    }

    public static void main(String args[]) {
        BubbleSort ob = new BubbleSort();
        int arr[] = {${data.array ? data.array.join(", ") : "10, 20, 5, 3"}};
        ob.bubbleSort(arr);
        System.out.println("Sorted array");
        for (int i=0; i<arr.length; ++i)
            System.out.print(arr[i] + " ");
    }
}`,
        python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]

# Example
numbers = [${data.array ? data.array.join(", ") : "10, 20, 5, 3"}]
bubble_sort(numbers)
print("Bubble Sort:", numbers)`
    }),
    "selection-sort": (data: any) => ({
        c: `#include <stdio.h>

void selectionSort(int arr[], int n) {
    int i, j, min_idx;
    for (i = 0; i < n - 1; i++) {
        min_idx = i;
        for (j = i + 1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}

int main() {
    int arr[] = {${data.array ? data.array.join(", ") : "10, 20, 5, 3"}};
    int n = sizeof(arr)/sizeof(arr[0]);
    selectionSort(arr, n);
    printf("Sorted array: \\n");
    for (int i=0; i < n; i++)
        printf("%d ", arr[i]);
    return 0;
}`,
        java: `import java.util.Arrays;

class SelectionSort {
    void selectionSort(int arr[]) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int min_idx = i;
            for (int j = i + 1; j < n; j++)
                if (arr[j] < arr[min_idx])
                    min_idx = j;
            int temp = arr[min_idx];
            arr[min_idx] = arr[i];
            arr[i] = temp;
        }
    }

    public static void main(String args[]) {
        SelectionSort ob = new SelectionSort();
        int arr[] = {${data.array ? data.array.join(", ") : "10, 20, 5, 3"}};
        ob.selectionSort(arr);
        System.out.println("Sorted array");
        for (int i=0; i<arr.length; ++i)
            System.out.print(arr[i] + " ");
    }
}`,
        python: `def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i + 1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]

# Example
numbers = [${data.array ? data.array.join(", ") : "10, 20, 5, 3"}]
selection_sort(numbers)
print("Selection Sort:", numbers)`
    }),
    "insertion-sort": (data: any) => ({
        c: `#include <stdio.h>

void insertionSort(int arr[], int n) {
    int i, key, j;
    for (i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}

int main() {
    int arr[] = {${data.array ? data.array.join(", ") : "10, 20, 5, 3"}};
    int n = sizeof(arr)/sizeof(arr[0]);
    insertionSort(arr, n);
    printf("Sorted array: \\n");
    for (int i=0; i < n; i++)
        printf("%d ", arr[i]);
    return 0;
}`,
        java: `import java.util.Arrays;

class InsertionSort {
    void insertionSort(int arr[]) {
        int n = arr.length;
        for (int i = 1; i < n; ++i) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
    }

    public static void main(String args[]) {
        InsertionSort ob = new InsertionSort();
        int arr[] = {${data.array ? data.array.join(", ") : "10, 20, 5, 3"}};
        ob.insertionSort(arr);
        System.out.println("Sorted array");
        for (int i=0; i<arr.length; ++i)
            System.out.print(arr[i] + " ");
    }
}`,
        python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key

# Example
numbers = [${data.array ? data.array.join(", ") : "10, 20, 5, 3"}]
insertion_sort(numbers)
print("Insertion Sort:", numbers)`
    }),
    "quick-sort": (data: any) => ({
        c: `#include <stdio.h>

void swap(int* a, int* b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    int arr[] = {${data.array ? data.array.join(", ") : "10, 20, 5, 3"}};
    int n = sizeof(arr)/sizeof(arr[0]);
    quickSort(arr, 0, n - 1);
    printf("Sorted array: \\n");
    for (int i=0; i < n; i++)
        printf("%d ", arr[i]);
    return 0;
}`,
        java: `import java.util.Arrays;

class QuickSort {
    int partition(int arr[], int low, int high) {
        int pivot = arr[high];
        int i = (low - 1);
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }

    void quickSort(int arr[], int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    public static void main(String args[]) {
        int arr[] = {${data.array ? data.array.join(", ") : "10, 20, 5, 3"}};
        int n = arr.length;
        QuickSort ob = new QuickSort();
        ob.quickSort(arr, 0, n - 1);
        System.out.println("Sorted array");
        for (int i=0; i<n; ++i)
            System.out.print(arr[i] + " ");
    }
}`,
        python: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[0]   # take first element as pivot
    left = []
    right = []

    # divide elements
    for i in range(1, len(arr)):
        if arr[i] <= pivot:
            left.append(arr[i])
        else:
            right.append(arr[i])

    # recursive call
    return quick_sort(left) + [pivot] + quick_sort(right)


# Example
numbers = [${data.array ? data.array.join(", ") : "10, 20, 5, 3"}]
result = quick_sort(numbers)
print("Quick Sort:", result)`
    }),
    "merge-sort": (data: any) => ({
        c: `#include <stdio.h>

void merge(int arr[], int l, int m, int r) {
    int i, j, k;
    int n1 = m - l + 1;
    int n2 = r - m;
    int L[n1], R[n2];
    for (i = 0; i < n1; i++) L[i] = arr[l + i];
    for (j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    i = 0; j = 0; k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}

int main() {
    int arr[] = {${data.array ? data.array.join(", ") : "10, 20, 5, 3"}};
    int n = sizeof(arr)/sizeof(arr[0]);
    mergeSort(arr, 0, n - 1);
    printf("Sorted array: \\n");
    for (int i=0; i < n; i++)
        printf("%d ", arr[i]);
    return 0;
}`,
        java: `import java.util.Arrays;

class MergeSort {
    void merge(int arr[], int l, int m, int r) {
        int n1 = m - l + 1;
        int n2 = r - m;
        int L[] = new int[n1];
        int R[] = new int[n2];
        for (int i = 0; i < n1; ++i) L[i] = arr[l + i];
        for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];
        int i = 0, j = 0;
        int k = l;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            k++;
        }
        while (i < n1) {
            arr[k] = L[i];
            i++;
            k++;
        }
        while (j < n2) {
            arr[k] = R[j];
            j++;
            k++;
        }
    }

    void sort(int arr[], int l, int r) {
        if (l < r) {
            int m = l + (r - l) / 2;
            sort(arr, l, m);
            sort(arr, m + 1, r);
            merge(arr, l, m, r);
        }
    }

    public static void main(String args[]) {
        int arr[] = {${data.array ? data.array.join(", ") : "10, 20, 5, 3"}};
        MergeSort ob = new MergeSort();
        ob.sort(arr, 0, arr.length - 1);
        System.out.println("Sorted array");
        for (int i=0; i<arr.length; ++i)
            System.out.print(arr[i] + " ");
    }
}`,
        python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = arr[:mid]
    right = arr[mid:]

    # recursive calls
    left = merge_sort(left)
    right = merge_sort(right)

    return merge(left, right)


def merge(left, right):
    result = []
    i = 0
    j = 0

    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i = i + 1
        else:
            result.append(right[j])
            j = j + 1

    # add remaining elements
    while i < len(left):
        result.append(left[i])
        i = i + 1

    while j < len(right):
        result.append(right[j])
        j = j + 1

    return result


# Example
numbers = [${data.array ? data.array.join(", ") : "10, 20, 5, 3"}]
result = merge_sort(numbers)
print("Merge Sort:", result)`
    }),
    "linear-search": (data: any) => ({
        c: `#include <stdio.h>

int search(int arr[], int n, int x) {
    int i;
    for (i = 0; i < n; i++)
        if (arr[i] == x)
            return i;
    return -1;
}

int main() {
    int arr[] = {${data.array ? data.array.join(", ") : "10, 20, 5, 3"}};
    int x = ${data.target || 0};
    int n = sizeof(arr) / sizeof(arr[0]);
    int result = search(arr, n, x);
    (result == -1) ? printf("Element is not present in array")
                   : printf("Element is present at index %d", result);
    return 0;
}`,
        java: `import java.util.Arrays;

class LinearSearch {
    public static int search(int arr[], int x) {
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            if (arr[i] == x)
                return i;
        }
        return -1;
    }

    public static void main(String args[]) {
        int arr[] = {${data.array ? data.array.join(", ") : "10, 20, 5, 3"}};
        int x = ${data.target || 0};
        int result = search(arr, x);
        if (result == -1)
            System.out.print("Element is not present in array");
        else
            System.out.print("Element is present at index " + result);
    }
}`,
        python: `def search(arr, n, x):
    for i in range(0, n):
        if (arr[i] == x):
            return i
    return -1

# Example
arr = [${data.array ? data.array.join(", ") : "10, 20, 5, 3"}]
x = ${data.target || 0}
n = len(arr)
result = search(arr, n, x)
if(result == -1):
    print("Element is not present in array")
else:
    print("Element is present at index", result)`
    }),
    "binary-search": (data: any) => ({
        c: `#include <stdio.h>

int binarySearch(int arr[], int l, int r, int x) {
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x) return m;
        if (arr[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}

int main() {
    int arr[] = {${data.array ? data.array.join(", ") : "10, 20, 5, 3"}};
    int n = sizeof(arr) / sizeof(arr[0]);
    int x = ${data.target || 0};
    int result = binarySearch(arr, 0, n - 1, x);
    (result == -1) ? printf("Element is not present in array")
                   : printf("Element is present at index %d", result);
    return 0;
}`,
        java: `import java.util.Arrays;

class BinarySearch {
    int binarySearch(int arr[], int x) {
        int l = 0, r = arr.length - 1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (arr[m] == x) return m;
            if (arr[m] < x) l = m + 1;
            else r = m - 1;
        }
        return -1;
    }

    public static void main(String args[]) {
        BinarySearch ob = new BinarySearch();
        int arr[] = {${data.array ? data.array.join(", ") : "10, 20, 5, 3"}};
        int n = arr.length;
        int x = ${data.target || 0};
        int result = ob.binarySearch(arr, x);
        if (result == -1)
            System.out.println("Element not present");
        else
            System.out.println("Element found at index " + result);
    }
}`,
        python: `def binary_search(arr, low, high, x):
    if high >= low:
        mid = (high + low) // 2
        if arr[mid] == x:
            return mid
        elif arr[mid] > x:
            return binary_search(arr, low, mid - 1, x)
        else:
            return binary_search(arr, mid + 1, high, x)
    else:
        return -1

# Example
arr = [${data.array ? data.array.join(", ") : "10, 20, 5, 3"}]
x = ${data.target || 0}
result = binary_search(arr, 0, len(arr)-1, x)
if result != -1:
    print("Element is present at index", str(result))
else:
    print("Element is not present in array")`
    }),
    "bfs": (data: any) => ({
        c: `#include <stdio.h>

// BFS implementation depends on Graph structure
// Example graph traversal
// Visit: ${data.visited ? data.visited.join(" -> ") : "..."}

int main() {
    printf("Breadth First Search Traversal");
    return 0;
}
`,
        java: `import java.util.*;

// BFS implementation depends on Graph structure
// Example graph traversal
// Visit: ${data.visited ? data.visited.join(" -> ") : "..."}

class BFS {
    public static void main(String args[]) {
        System.out.println("Breadth First Search Traversal");
    }
}
`,
        python: `def bfs(visited, graph, node):
    visited.append(node)
    queue.append(node)

    while queue:
        s = queue.pop(0)
        print (s, end = " ")

        for neighbour in graph[s]:
            if neighbour not in visited:
                visited.append(neighbour)
                queue.append(neighbour)

# Example Graph
graph = ${JSON.stringify(data.graph || {}).replace(/"/g, "")}
visited = []
queue = []

bfs(visited, graph, 0)
`
    }),
    "dfs": (data: any) => ({
        c: `#include <stdio.h>
// DFS implementation depends on Graph structure
// Example graph traversal
// Visit: ${data.visited ? data.visited.join(" -> ") : "..."}
`,
        java: `import java.util.*;
// DFS implementation depends on Graph structure
// Example graph traversal
// Visit: ${data.visited ? data.visited.join(" -> ") : "..."}
`,
        python: `def dfs(visited, graph, node):
    if node not in visited:
        print (node)
        visited.add(node)
        for neighbour in graph[node]:
            dfs(visited, graph, neighbour)

# Example Graph
graph = ${JSON.stringify(data.graph || {}).replace(/"/g, "")}
visited = set()

dfs(visited, graph, 0)`
    })
};
