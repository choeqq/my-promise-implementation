class UncaughtPromiseError extends Error {
  constructor(e) {
    super(e);

    this.stack = `(in promise) ${e.stack}`;
  }
}

module.exports = UncaughtPromiseError;
