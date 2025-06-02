const setA = new Set([2, 2, 3]);
const setB = new Set([3, 4, 5]);

// 并集 
const union = [...new Set([...setA, ...setB])];

console.log("这是冲突的部分",setA)
console.log(union)