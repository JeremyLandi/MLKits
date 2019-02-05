const k = 3;
let outputs = [];

// Everytime a ball is dropped into a bucket
const onScoreUpdate = (dropPosition, bounciness, size, bucketLabel) => {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

// Gets absolute difference between the 2 distances
const distance = (pointA, pointB) => Math.abs(pointA - pointB);

const splitDataset = (data, testCount) => {
  const shuffled = _.shuffle(data);
  
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);
  return [testSet, trainingSet];
}

// k-nearest neightbors (classification)
const knn = (data, point) => {
  return _.chain(data)
  .map(row => [distance(row[0], point), row[3]])  // Returns new array with "absolute" distance and bucket number
  .sortBy(row => row[0])                          // Sorts from smallest distance to greatest
  .slice(0, k)                                    // Gets the top "k" amount
  .countBy(row => row[1])                         // Returns an object with the bucket # as the Key, and the 'count' of those buckets as the Value  
  .toPairs()                                      // Returns an array or arrays from an object
  .sortBy(row => row[1])                          // Sorts smallest 'count' to the greatest 'count'
  .last()                                         // Returns array with greatest 'count'
  .first()                                        // Returns greatest count (as string)
  .parseInt()
  .value();
}

const runAnalysis = () => {
  const testSetSize = 10;
  const [testSet, trainingSet] = splitDataset(outputs, testSetSize);
  
  const accuracy = _.chain(testSet)
    .filter(testPoint => knn(trainingSet, testPoint[0]) === testPoint[3]) // Returns the sets that were correct
    .size()                                                               // Counts the number of sets correct
    .divide(testSetSize)
    .multiply(100)
    .value();
    console.log("Accuracy is:", accuracy+"%");
}