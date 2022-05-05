class MyPromise {
  constructor(cb) {
    try {
      cb(this.#onSuccess, this.#onFail);
    } catch (e) {
      this.onFail(e);
    }
  }

  #onSuccess(value) {}

  #onFail(value) {}
}

module.exports = MyPromise;

new Promise((resolve, reject));
