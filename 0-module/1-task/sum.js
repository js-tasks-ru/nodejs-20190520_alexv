function sum(a, b) {
  if (typeof(a) !== 'number' || typeof(b) !== 'number' || isNaN(a) || isNaN(b)) {
    throw new TypeError();
  }

  return a + b;
}

module.exports = sum;
