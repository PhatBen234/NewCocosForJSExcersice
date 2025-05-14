cc.Class({
  extends: cc.Component,

  properties: {
    logLabel: cc.Label, // kéo node Label vào đây
  },

  start() {
    // Truyền label xuống LazyMan để in ra
    const lazyMan = new LazyMan('jack', this.logLabel);
    lazyMan
      .eat('apple')
      .sleep(5000)
      .eat('hamburger')
      .sleep(3000)
      .eat('pear');
  },
});

class LazyMan {
  constructor(name, label) {
    this.queue = [];
    this.label = label; // giữ tham chiếu label
    this.sayName(name);
    this._run(); // bắt đầu thực thi hàng đợi
  }

  _log(message) {
    cc.log(message);
    if (this.label) {
      this.label.string += message + '\n';
    }
  }

  sayName(name) {
    this.queue.push(() => {
      this._log(`My name is ${name}`);
      return Promise.resolve();
    });
  }

  eat(food) {
    this.queue.push(() => {
      this._log(`I am eating ${food}`);
      return Promise.resolve();
    });
    return this;
  }

  sleep(ms) {
    this.queue.push(() => {
      this._log(`I am sleeping...`);
      return new Promise(resolve => {
        setTimeout(() => {
          this._log(`After ${ms / 1000} seconds`);
          resolve();
        }, ms);
      });
    });
    return this;
  }

  async _run() {
    for (const action of this.queue) {
      await action();
    }
  }
}
