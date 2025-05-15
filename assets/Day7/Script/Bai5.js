cc.Class({
  extends: cc.Component,
  properties: {
    timeLabel: cc.Label,  // Kết nối Label với thuộc tính trong Cocos Creator
  },

  start() {
    this.logLatency();
  },

  async getServerTime() {
    try {
      const response = await fetch(window.location.href.toString(), {
        method: 'HEAD',
        headers: {
          'Content-Type': 'text/html'
        }
      });

      const dateHeader = response.headers.get('Date');

      if (!dateHeader) {
        throw new Error('Không thể lấy header "Date" từ response');
      }

      cc.log('Header Date từ server: ' + dateHeader); // Log giá trị Date từ server
      return new Date(dateHeader).getTime();
    } catch (error) {
      cc.error('Lỗi khi lấy thời gian từ server:', error);
      return Date.now(); // fallback nếu lỗi
    }
  },

  async logLatency() {
    let startTime = await this.getServerTime();
    cc.log('Thời gian bắt đầu: ' + startTime);
    this.timeLabel.string = `Thời gian bắt đầu: ${startTime}`; // Hiển thị thời gian bắt đầu lên Label

    for (let i = 0; i < 10; i++) {
      const currentTime = await this.getServerTime();
      const latency = currentTime - startTime;
      cc.log('Thời gian hiện tại: ' + currentTime);
      cc.log(`Độ trễ: ${latency}ms`);

      // Hiển thị kết quả mỗi lần vào Label
      this.timeLabel.string = `Thời gian hiện tại: ${currentTime}\nĐộ trễ: ${latency}ms`;

      startTime = currentTime;

      // Delay 1 giây giữa các lần gọi để giá trị thay đổi rõ rệt
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 giây
    }
  }
});
