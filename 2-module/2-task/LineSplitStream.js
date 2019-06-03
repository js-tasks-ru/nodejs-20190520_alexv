const stream = require('stream');
const os = require('os');
const StringDecoder = require('string_decoder').StringDecoder;

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.encoding = options.encoding;
    this.waitingChunk = '';
  }

  _transform(chunk, encoding, callback) {
    if (!this.myStringDecoder) {
      this.myStringDecoder = new StringDecoder(this.encoding);
    }

    const encodedText = this.myStringDecoder.write(chunk);
    const encodedChunks = encodedText.split(os.EOL);
    const waitingChunk = encodedChunks.pop(); // 'текст' или пустая строка ''

    encodedChunks.forEach((encodedChunk, index) => {
      let chunkForPush = encodedChunk;

      if (this.waitingChunk && index === 0) {
        chunkForPush = this.waitingChunk + encodedChunk;
        this._resetWaitingChunk();
      }

      this.push(chunkForPush);
    });

    this._resizeWaitingChunk(waitingChunk);
    callback();
  }

  _flush(callback) {
    this.waitingChunk && callback(null, this.waitingChunk);
  }

  _resizeWaitingChunk(chunk) {
    this.waitingChunk += chunk;
  }

  _resetWaitingChunk() {
    this.waitingChunk = '';
  }
}

module.exports = LineSplitStream;
