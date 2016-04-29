/**
 * Collection of Sorting algorithms.
 */

class SortAlgo {
    /**
     * Create a SortAlgo and set the default sorting algorithm
     * @params {array} - The array you want to sort
     * @params {string} - The name of the default sorting algorithm
     */
    constructor(list, name) {
        if (!list instanceof Array) throw new TypeError("Expected array", "sort.js", 14);
        this.ALGO_LIST = ["insertion", "selection", "bubble", "quick", "merge", "radix", "counting", "bucket", "heap"];
        this.list = list || [];
        this.algo = this.ALGO_LIST.indexOf(name) > -1 ? name : "insertion";
        this.cost = 0;
    }
    /**
     * Run sort
     */
    sort() {
        return this[this.algo]();
    }
    /**
     * The insertion sort
     */
    insertion() {
        let list = this.list;
        for (let i = 1; i < list.length; i++) {
            let cur = list[i],
                j = i-1;
            while(j >= 0 && list[j] > cur) {
                this.swap(j,j+1)
                j--;
            }
        }
        return this.list;
    }
    /**
     * The selection sosrt
     */
    selection() {
        let list = this.list,
            minIndex = -1;
        for (let i = 0; i < list.length; i++) {
            minIndex = i;
            for (let j = i+1; j < list.length; j++) {
                minIndex = list[minIndex] < list[j] ? minIndex : j;
            }
            this.swap(minIndex,i);
        }
        return this.list;
    }
    /**
     * Bubble sosrt
     */
    bubble() {
        let list = this.list,
            flag = true;
        while(flag) {
            flag = false;
            for (let i = 1; i < list.length; i++) {
                if (list[i-1] > list[i]) {
                    flag = true;
                    this.swap(i-1,i);
                }
            }
        }
        return this.list;
    }
    /**
     * Couting sort
     */
    counting() {
        let list = this.list,
            idx = 0,
            buckets = [];
        for (let i = 0; i < list.length; i++) {
            buckets[list[i]] = buckets[list[i]] || 0;
            buckets[list[i]] ++;
        }
        for (let i = 0; i < buckets.length; i++) {
            while (buckets[i] && buckets[i] > 0) {
                this.list[idx++] = i;
                buckets[i] --;
            }
        }
        return this.list;
    }
    /**
     * Merge sort
     * @params {array} list - The list you want to sort, default will be this.list
     */
    merge(list = this.list) {
        if (list.length <= 1) return list;
        let mid = parseInt(list.length / 2);
        this.list = this.mergeHelper( this.merge(list.slice(0,mid)), this.merge(list.slice(mid)) );
        return this.list;
    }
    /**
     * Helper function for merge two sub-lists
     * @params: {array} list - Left sub-list
     * @params: {array} right - Right sub-list
     */
    mergeHelper(left, right) {
        let i = 0, j = 0,
            nl = [];
        while (i < left.length && j < right.length) {
            if (left[i] < right[j]) {
                nl.push(left[i++]);
            } else {
                nl.push(right[j++]);
            }
        }
        nl = nl.concat(left.slice(i)).concat(right.slice(j));
        return nl;
    }
    /**
     * Quick Sort
     * @params {number} left - left index of this round of sort, default initial value is 0
     * @params {number} right - right index of this round of sort, default initial value is list.length - 1
     */
    quick(left = 0, right = this.list.length-1) {
        let idx = this.partition(left,right);
        
        if (left < idx - 1) {
            this.quick(left, idx-1);
        } 
        if (idx < right) {
            this.quick(idx, right);
        }
        return this.list;
    }
    /**
     * Helper function for quick sort - partition
     * @params {number} begin - begin index of this round of partition
     * @params {number} end - end index of this round of partition
     */
    partition(begin, end) {
        let list = this.list,
            pivot = parseInt(Math.random()*(end - begin + 1) + begin);

        while (begin <= end) {
            while (list[begin] < list[pivot]) {
                begin ++;
            }
            while (list[end] > list[pivot]) {
                end --;
            }
            if (begin <= end) {
                this.swap(begin, end);
                begin ++;
                end --;
            }
        }
        return begin;
    }
    /**
     * Radix sort - only for integers
     */
    radix() {
		let list = this.list,
            max = parseInt(Math.log10(Math.max.apply(Math,list))),
    	    idx = 0;
    	for (let i = 0; i < max + 1; i++) {
    	  let digitBuckets = [];
    	  for (let j = 0; j < list.length; j++) {
    	    let digit = this.getDigit(list[j],i+1);
    	    digitBuckets[digit] = digitBuckets[digit] || [];
    	    digitBuckets[digit].push(list[j]);
    	  }
    	  idx = 0;
    	  for (let t = 0; t < digitBuckets.length; t++) {
    	    if (digitBuckets[t] && digitBuckets[t].length > 0) {
    	      for (let j = 0; j < digitBuckets[t].length; j++) {
    	        list[idx++] = digitBuckets[t][j];
    	      }
    	    }
    	  }
    	}
    	return this.list
    }
    /**
     * Heap sort
     */
    heap() {
		let list = this.list;
		this.buildHeap();
    	for (let i = list.length - 1; i >= 1; i--) {
    	  this.swap(0, i);
    	  this.heapify(0, i);
    	}
    	return this.list
    }
    /**
     * Convert this.list to a heap
     */
	buildHeap(){
		let list = this.list,
			mid = parseInt(list.length / 2) - 1;
		for (let i = mid; i >= 0; i--) {
			this.heapify(i, list.length);
		}
	}
    /** 
     * Heapify from idx to max
     * @params {number} start - start index
     * @params {number} end - end index
     */
	heapify(start, end) {
		let list = this.list,
			left = 2*start + 1,
			right = 2*start + 2,
			largest;
		largest = left < end && list[left] > list[start] ? left: start;
		largest = right < end  && list[right] > list[largest] ? right : largest;
		if(largest !== start) {
			this.swap(largest, start);
			this.heapify(largest, end);
		}
	}
	/**
	 * Swap two elements' position
	 * @params {number} i - The first element's index
	 * @params {number} j - The second element's index
	 */
	swap(i,j) {
		let temp = this.list[i];
		this.list[i] = this.list[j];
		this.list[j] = temp;
	}
	/**
	 * get nth digit of the number
	 * @params {number} num - The number
	 * @params {number} nth - nth digit we want
	 */
	getDigit(num,nth) {
		var ret = 0;
		while(nth--){
			ret = num % 10
				num = parseInt((num - ret) / 10)
		}
		return ret
	}
}

// test
let list = Array(50).fill(0).map( () => Math.random()*50);
let k = new SortAlgo(list,"heap");

let l = k.sort();
console.log(l)
