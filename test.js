const setA = new Set([1, 2, 3]);
const setB = new Set([3, 4, 5]);

// 并集
const union = [...new Set([...setA, ...setB])];

console.log(union)