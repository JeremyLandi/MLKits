let outputs = [];

// Everytime a ball is dropped into a bucket
const onScoreUpdate = (dropPosition, bounciness, size, bucketLabel) => {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

// *** N-Dimension distance using Pythagorean Theorem
const distance = (pointA, pointB) => {
  return _.chain(pointA)
          .zip(pointB)                 // Creates an array of grouped elements, the first of which contains the first elements of the given arrays and so on.
          .map(([a, b]) => (a-b)**2)
          .sum()
          .value() ** 0.5;
};

const splitDataset = (data, testCount) => {
  const shuffled = _.shuffle(data);
  
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);
  return [testSet, trainingSet];
}

// k-nearest neightbors (classification)
const knn = (data, point, k) => {
  return _.chain(data)
  .map(row => {
    return [
      distance( _.initial(row), point),  // _.initial gets all except last value of array
      _.last(row)
    ];
  })                                     // Returns new array with "absolute" distance and bucket number
  .sortBy(row => row[0])                 // Sorts from smallest distance to greatest
  .slice(0, k)                           // Gets the top "k" amount
  .countBy(row => row[1])                // Returns an object with the bucket # as the Key, and the 'count' of those buckets as the Value  
  .toPairs()                             // Returns an array or arrays from an object
  .sortBy(row => row[1])                 // Sorts smallest 'count' to the greatest 'count'
  .last()                                // Returns array with greatest 'count'
  .first()                               // Returns greatest count (as string)
  .parseInt()
  .value();
}

const runAnalysis = () => {
  const testSetSize = 100;
  const [testSet, trainingSet] = splitDataset(outputs, testSetSize);
  
  _.range(1, 11).forEach(k => {
    const accuracy = _.chain(testSet)
      .filter(testPoint => {
        return knn(trainingSet, _.initial(testPoint), k) === testPoint[3];
      })                                                                   // Returns the sets that were correct
      .size()                                                              // Counts the number of sets correct
      .divide(testSetSize)
      .multiply(100)
      .value();
    console.log("for k of",k, "Accuracy is:", accuracy+"%");
  });
}