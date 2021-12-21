const DICTIONARY = require('./utils/dictionary');
const tf = require('@tensorflow/tfjs');
const tfn = require('@tensorflow/tfjs-node');

async function checkSpam(feedback) {
  let model;
  const ENCODING_LENGTH = 50;
  let isSpam = false;
  const THRESHOLD = 0.75;

  const lowercaseSentenceArray = feedback
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(' ')
    .slice(0, 49);
  await loadAndPredict(tokenize(lowercaseSentenceArray), feedback);

  function tokenize(wordArray) {
    // Always start with the START token.
    let returnArray = [DICTIONARY.START];

    // Loop through the words in the sentence you want to encode.
    // If word is found in dictionary, add that number else
    // you add the UNKNOWN token.
    for (var i = 0; i < wordArray.length; i++) {
      let encoding = DICTIONARY.LOOKUP[wordArray[i]];
      returnArray.push(encoding === undefined ? DICTIONARY.UNKNOWN : encoding);
    }

    // Finally if the number of words was < the minimum encoding length
    // minus 1 (due to the start token), fill the rest with PAD tokens.
    while (i < ENCODING_LENGTH - 1) {
      returnArray.push(DICTIONARY.PAD);
      i++;
    }

    // Convert to a TensorFlow Tensor and return that.
    return tfn.tensor([returnArray]);
  }

  async function loadAndPredict(inputTensor, domComment) {
    // Load the model.json and binary files you hosted. Note this is
    // an asynchronous operation so you use the await keyword
    if (model === undefined) {
      const handler = `file:///${__dirname}/assets/model.json`;

      model = await tf.loadLayersModel(handler);
      //   console.log('Model loaded.');
    }
    // Once model has loaded you can call model.predict and pass to it
    // an input in the form of a Tensor. You can then store the result.
    var results = await model.predict(inputTensor);

    // Print the result to the console for us to inspect.
    // results.print();

    await results.data().then((dataArray) => {
      if (dataArray[1] > THRESHOLD) {
        isSpam = true;
      }
    });
  }
  return isSpam;
}

module.exports = checkSpam;
