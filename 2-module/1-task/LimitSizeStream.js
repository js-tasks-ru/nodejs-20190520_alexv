const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.transferredBytes = 0;
  }

  _transform(chunk, encoding, callback) {
    if (this.transferredBytes < this.limit) {
      this.transferredBytes += Buffer.byteLength(chunk);
      callback(null, chunk);
    } else {
      callback(new LimitExceededError());
    }
  }
}

module.exports = LimitSizeStream;
