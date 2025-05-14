cc.Class({
  extends: cc.Component,

  properties: {
    timeLabel: cc.Label,  
  },

  onLoad() {
    this.fetchServerTime();
  },

  async fetchServerTime() {
    try {
      const response = await fetch(window.location.href, {
        method: 'HEAD',
      });

      const serverDate = response.headers.get("Date");

      if (!serverDate) {
        throw new Error("Không lấy được thời gian từ header.");
      }

      const timeStr = new Date(serverDate).toISOString();
      this.timeLabel.string = "🕒 Server Time: " + timeStr;
    } catch (err) {
      cc.error("❌ Lỗi khi lấy thời gian server:", err.message);
      const localTime = new Date().toISOString();
      this.timeLabel.string = "🕒 Local Time: " + localTime;
    }
  },
});
