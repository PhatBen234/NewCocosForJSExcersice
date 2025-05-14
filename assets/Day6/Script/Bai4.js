cc.Class({
  extends: cc.Component,

  start() {
    class Store {
      constructor(name) {
        this.name = name;
        this.dependencies = [];  // Danh sách các store phải chờ
      }

      wait(store) {
        this.dependencies.push(store);
      }

      async resolve(stepTime, visited = new Set(), results = []) {
        // Nếu đã xử lý rồi thì bỏ qua (tránh vòng lặp)
        if (visited.has(this)) return;

        visited.add(this);

        for (const dep of this.dependencies) {
          await dep.resolve(stepTime, visited, results);
        }

        // Đợi thời gian stepTime (giây)
        await new Promise(resolve => setTimeout(resolve, stepTime * 1000));
        cc.log(this.name); // In ra tên store
        results.push(this.name);
      }
    }

    async function contribute(stepTime, ...stores) {
      const visited = new Set();
      const results = [];

      for (const store of stores) {
        await store.resolve(stepTime, visited, results);
      }

      cc.log('Hoàn tất:', results.join(' → '));
    }

    // Khởi tạo và gán quan hệ giữa các store
    const store1 = new Store('store_1');
    const store2 = new Store('store_2');
    const store3 = new Store('store_3');
    const store4 = new Store('store_4');
    const store5 = new Store('store_5');

    store1.wait(store3);
    store3.wait(store2);
    store2.wait(store5);
    store5.wait(store4);

    contribute(3, store1, store2, store3, store4, store5);
  }
});
