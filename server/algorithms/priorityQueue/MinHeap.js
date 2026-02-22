class MinHeap {
    constructor() {
        this.heap = [];
    }

    insert(element) {
        this.heap.push(element);
        this.bubbleUp();
    }

    extractMin() {
        if (this.heap.length === 1) return this.heap.pop();
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.sinkDown(0);
        return min;
    }

    bubbleUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[index].priority >= this.heap[parentIndex].priority) break;
            // Swap
            let temp = this.heap[parentIndex];
            this.heap[parentIndex] = this.heap[index];
            this.heap[index] = temp;
            index = parentIndex;
        }
    }

    sinkDown(index) {
        let length = this.heap.length;
        while (true) {
            let leftChildIdx = 2 * index + 1;
            let rightChildIdx = 2 * index + 2;
            let smallest = index;

            if (leftChildIdx < length && this.heap[leftChildIdx].priority < this.heap[smallest].priority) {
                smallest = leftChildIdx;
            }
            if (rightChildIdx < length && this.heap[rightChildIdx].priority < this.heap[smallest].priority) {
                smallest = rightChildIdx;
            }

            if (smallest === index) break;

            // Swap
            let temp = this.heap[smallest];
            this.heap[smallest] = this.heap[index];
            this.heap[index] = temp;

            index = smallest;
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}

module.exports = MinHeap;
