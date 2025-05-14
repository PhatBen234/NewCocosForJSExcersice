cc.Class({
  extends: cc.Component,

  properties: {
    displaySprite: cc.Sprite, // Sprite để hiển thị ảnh
  },

  start() {
    this.imageUrls = [
      'https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU',
      'https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4',
      'https://fastly.picsum.photos/id/2/5000/3333.jpg?hmac=_KDkqQVttXw_nM-RyJfLImIbafFrqLsuGO5YuHqD-qQ',
      'https://fastly.picsum.photos/id/3/5000/3333.jpg?hmac=GDjZ2uNWE3V59PkdDaOzTOuV3tPWWxJSf4fNcxu4S2g',
    ];

    this.downloadImagesSequentially(this.imageUrls);
  },

  async downloadImagesSequentially(urls) {
    for (let i = 0; i < urls.length; i++) { // vong lap chay qua tung URL trong mang
      try {
        cc.log(`Đang tải ảnh ${i + 1}/${urls.length}`); //ghi log anh thu may/ tong? dc tai?
        const texture = await this.downloadImage(urls[i]); // goi ham dowloadImage o duoi de tai anh
        this.displaySprite.spriteFrame = new cc.SpriteFrame(texture); // gan vo spriteframe de tai hinh
        cc.log(`Đã hiển thị ảnh ${i + 1}`);
        await this.delay(2000); // Delay 2 giây moi tai anh tiep theo
      } catch (error) {
        cc.error(`Lỗi khi tải ảnh ${i + 1}:`, error);
      }
    }
  },

  downloadImage(url) {
    return new Promise((resolve, reject) => {
      cc.loader.load({ url: url, type: 'jpg' }, (err, texture) => {
        if (err) {
          reject(err); // that bai
        } else {
          resolve(texture); // tra ve textture neu thanh cong
        }
      });
    });
  },

  delay(ms) {// delay bang promise
    return new Promise(resolve => setTimeout(resolve, ms));
  }
});
