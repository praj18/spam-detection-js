# spam-detection-js

Small package based on Naive Bayes classifier to classify messages as spam or ham.

# Install

```
npm install spam-detection

```

# Usage

```
const checkSpam = require('spam-detection-js');

let text = 'Congratulations! You have won an iphone 20!'

checkSpam(text).then((isSpam) => {
  console.log('isSpam', isSpam);
});
```

# License

ISC
