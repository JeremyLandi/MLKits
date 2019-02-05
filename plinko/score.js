const k = 3;
const predictionPoint = 300;
let outputs = [];

const onScoreUpdate = (dropPosition, bounciness, size, bucketLabel) => {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

const distance = (point) => Math.abs(point - predictionPoint);

const runAnalysis = () => {
  const bucket =  _.chain(outputs)
  .map(row => [distance(row[0]), row[3]])
  .sortBy(row => row[0])
  .slice(0, k)
  .countBy(row => row[1])
  .toPairs()
  .sortBy(row => row[1])
  .last()
  .first()
  .parseInt()
  .value();

  console.log('Your point will probably fall into bucket ', bucket);
}