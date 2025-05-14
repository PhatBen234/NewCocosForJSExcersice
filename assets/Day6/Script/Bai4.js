//ma oi bai nay khong hieu gi het

cc.Class({
  extends: cc.Component,

  properties: {
    logLabel: cc.Label, // Gán node Label từ Inspector để in kết quả log
  },

  start() {
    // ─── CLASS STORE ─────────────────────
    // Mỗi Store là một "công đoạn" có thể phụ thuộc vào công đoạn khác
    class Store {
      constructor(name) {
        this.name = name; // Tên của Store
        this.dependencies = []; // Danh sách các Store mà Store này phụ thuộc
      }

      // Thêm một store phụ thuộc vào danh sách
      wait(store) {
        this.dependencies.push(store);
      }

      // Giải quyết store theo thứ tự phụ thuộc (đệ quy)
      async resolve(stepTime, visited = new Set(), results = [], logFunc) {
        if (visited.has(this)) return; // Nếu đã xử lý rồi thì bỏ qua (tránh lặp vô hạn)

        visited.add(this); // Đánh dấu là đã xử lý

        // Giải quyết các phụ thuộc trước
        for (const dep of this.dependencies) {
          await dep.resolve(stepTime, visited, results, logFunc);
        }

        // Đợi stepTime giây trước khi thực hiện store này
        await new Promise(resolve => setTimeout(resolve, stepTime * 1000));

        cc.log(this.name); // In tên store ra console
        logFunc(this.name); // Ghi log vào Label UI
        results.push(this.name); // Lưu tên store đã hoàn thành vào mảng kết quả
      }
    }

    // ─── FUNCTION CONTRIBUTE ──────────────
    // Hàm chính thực thi toàn bộ các store truyền vào theo đúng thứ tự phụ thuộc
    async function contribute(stepTime, logFunc, ...stores) {
      const visited = new Set(); // Đánh dấu store đã thực hiện
      const results = []; // Lưu kết quả tên store theo thứ tự

      for (const store of stores) {
        await store.resolve(stepTime, visited, results, logFunc); // Giải quyết từng store
      }

      // Sau khi tất cả store xong, log kết quả cuối cùng
      const finalLog = 'Hoàn tất: ' + results.join(' → ');
      cc.log(finalLog);
      logFunc(finalLog);
    }

    // ─── LOG HELPER ───────────────────────
    // Ghi một dòng log vào Label UI
    const logToLabel = (msg) => {
      this.logLabel.string += msg + '\n';
    };

    // ─── TẠO CÁC STORE & PHỤ THUỘC ───────
    const store1 = new Store('store_1');
    const store2 = new Store('store_2');
    const store3 = new Store('store_3');
    const store4 = new Store('store_4');
    const store5 = new Store('store_5');

    // Thiết lập quan hệ phụ thuộc:
    // store1 -> store3 -> store2 -> store5 -> store4
    store1.wait(store3);
    store3.wait(store2);
    store2.wait(store5);
    store5.wait(store4);

    // ─── THỰC THI CHÍNH ───────────────────
    this.logLabel.string = ''; // Xóa nội dung label trước khi chạy
    contribute(3, logToLabel, store1, store2, store3, store4, store5);
    // Gọi contribute() với delay 3 giây giữa mỗi bước
  }
});
