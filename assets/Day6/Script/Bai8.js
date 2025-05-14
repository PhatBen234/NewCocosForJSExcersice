cc.Class({
  extends: cc.Component,

  properties: {
    timeLabel: cc.Label,
  },

  start() {
    // Hàm thường
    function getLocalTime() {
      return new Date().getTime();
    }

    // Hàm async
    async function getServerTime() {
      try {
        const response = await fetch(window.location.href.toString(), {
          method: 'HEAD',
          headers: {
            'Content-Type': 'text/html'
          }
        });

        const dateHeader = response.headers.get("Date");
        if (!dateHeader) throw new Error("Không có Date header");
        return new Date(dateHeader).getTime();
      } catch (err) {
        cc.error("Lỗi getServerTime:", err);
        return Date.now(); // fallback
      }
    }

    // Hàm promisify
    function promisify(fn) {
      return function (...args) {
        try {
          const result = fn(...args);
          return result instanceof Promise ? result : Promise.resolve(result);
        } catch (err) {
          return Promise.reject(err);
        }
      };
    }

    // Chạy thử
    (async () => {
      const localTime = await promisify(getLocalTime)();
      const serverTime = await promisify(getServerTime)();
      const latency = serverTime - localTime;

      const result = `Local Time: ${localTime}\nServer Time: ${serverTime}\nĐộ trễ: ${latency}ms`;
      cc.log(result);
      this.timeLabel.string = result;
    })();
  }
});
