cc.Class({
  extends: cc.Component,

  properties: {
    timeLabel: cc.Label,  
  },

  start() {
    this.fetchWithAutoRetry(this.simulateAPICall, 3);  // Gọi hàm retry với 3 lần thử lại
  },

  // Hàm thực hiện API Call giả lập
  simulateAPICall() {
    return new Promise((resolve, reject) => {
      // Giả lập 50% khả năng thất bại
      if (Math.random() < 0.5) {
        reject(new Error('API call failed'));
      } else {
        resolve('API call succeeded');
      }
    });
  },

  // Hàm retry request
  async fetchWithAutoRetry(fetcher, maximumRetryCount = 5) { // truyen so lan retry mac dinh la 5, no se chay 5 neu o tren ngta quen truyen vao
    let attempt = 0;
    while (attempt < maximumRetryCount) {
      try {
        const result = await fetcher();  // Thực hiện gọi API
        cc.log('Success:', result);  // Log thành công
        this.timeLabel.string = result;  // Hiển thị kết quả lên label
        return result;  // Nếu thành công, trả về kết quả
      } catch (error) {
        attempt++;  // Tăng số lần thử lại
        cc.log(`Attempt ${attempt} failed:`, error.message);  // Log lỗi
        if (attempt >= maximumRetryCount) {
          cc.log('All retries failed');  // Khi vượt quá số lần thử lại
          this.timeLabel.string = 'All retries failed';  // Hiển thị thông báo lên label
          throw new Error('All retries failed');
        }
        cc.log(`Retrying... (${attempt}/${maximumRetryCount})`);  // Log retry
        // Delay giữa các lần thử lại
        await new Promise(resolve => setTimeout(resolve, 1000));  // 1 giây
      }
    }
  }
});
