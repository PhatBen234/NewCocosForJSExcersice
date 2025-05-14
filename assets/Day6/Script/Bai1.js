cc.Class({
  extends: cc.Component,

  properties: {
    timeLabel: cc.Label,  
  },

  onLoad() {
    this.fetchServerTime(); //goi qua trinh lay thoi gian ngay khi node vua chay
  },

  async fetchServerTime() { // xai async thi xai dc await ben trong
    try {
      const response = await fetch(window.location.href, { //fetch, tuc gui http rq toi dia chi trang hien tai, 
        method: 'HEAD',//nhung chi can HEAD, k can noi dung trang
      });

      const serverDate = response.headers.get("Date"); // lay gia tri header tu Date

      if (!serverDate) {
        throw new Error("Không lấy được thời gian từ header.");// k co date xu ly loi o catch
      }

      const timeStr = new Date(serverDate).toISOString(); //convert string thanh date
      this.timeLabel.string = "🕒 Server Time: " + timeStr;
    } catch (err) { // neu co loi bat loi~
      cc.error("❌ Lỗi khi lấy thời gian server:", err.message);
      const localTime = new Date().toISOString();
      this.timeLabel.string = "🕒 Local Time: " + localTime;
    }
  },
});
