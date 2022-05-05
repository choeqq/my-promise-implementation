const STATE = {
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
  PENDING: "pending",
};

class MyPromise {
  #thenCbs = [];
  #catchCbs = [];
  #state = STATE.PENDING;
  #value;
  #onSuccessBind = this.#onSuccess.bind(this);
  #onFailBind = this.#onFail.bind(this);

  constructor(cb) {
    try {
      cb(this.#onSuccessBind, this.#onFailBind);
    } catch (e) {
      this.onFail(e);
    }
  }

  #runCallbacks() {
    if (this.#state === STATE.FULFILLED) {
      this.#thenCbs.forEach((callback) => {
        callback(this.#value);
      });

      this.#thenCbs = [];
    }

    if (this.#state === STATE.REJECTED) {
      this.#catchCbs.forEach((callback) => {
        callback(this.#value);
      });

      this.#catchCbs = [];
    }
  }

  #onSuccess(value) {
    // making code asynchronous, because Promises are always asynchronous, could be done with setTimeout, but Promises load way quicker than timeouts
    queueMicrotask(() => {
      if (this.#state !== STATE.PENDING) return;

      if (value instanceof MyPromise) {
        value.then(this.#onSuccessBind, this.#onFailBind);
        return;
      }

      this.#value = value;
      this.#state = STATE.FULFILLED;
      this.#runCallbacks();
    });
  }

  #onFail(value) {
    // making code asynchronous, because Promises are always asynchronous, could be done with setTimeout, but Promises load way quicker than timeouts
    queueMicrotask(() => {
      if (this.#state !== STATE.PENDING) return;

      if (value instanceof MyPromise) {
        value.then(this.#onSuccessBind, this.#onFailBind);
        return;
      }

      this.#value = value;
      this.#state = STATE.REJECTED;
      this.#runCallbacks();
    });
  }

  then(thenCb, catchCb) {
    return new MyPromise((resolve, reject) => {
      this.#thenCbs.push((result) => {
        if (thenCb === null) {
          resolve(result);
          return;
        }

        try {
          resolve(thenCb(result));
        } catch (e) {
          reject(e);
        }
      });

      this.#catchCbs.push((result) => {
        if (catchCb === null) {
          reject(result);
          return;
        }

        try {
          resolve(catchCb(result));
        } catch (e) {
          reject(e);
        }
      });

      this.#runCallbacks();
    });
  }

  catch(cb) {
    return this.then(undefined, cb);
  }

  finally(cb) {}
}

module.exports = MyPromise;
