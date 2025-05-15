cc.Class({
    extends: cc.Component,

    properties: {
        TimeOut: 10000,
        Tile: cc.Label,
        Body: cc.Label,

        spriteArray: {
            default: [],
            type: [cc.Sprite]
        }
    },

    fetchImageWithTimeout(url, timeout) {
        return new Promise((resolve, reject) => {
            const controller = new AbortController(); 
            const signal = controller.signal;

            const timeoutId = setTimeout(() => {
                controller.abort();
            }, timeout);

            fetch(url, { signal })
                .then(response => {
                    clearTimeout(timeoutId);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.blob();
                })
                .then(blob => {
                    let img = new Image();
                    img.src = URL.createObjectURL(blob);
                    img.onload = () => resolve(img);
                    img.onerror = err => reject(err);
                })
                .catch(error => {
                    if (error.name === 'AbortError') {
                        reject(new Error('Request timed out'));
                    } else {
                        reject(error);
                    }
                });
        });
    },

    async call() {
        const urls = [
            'https://picsum.photos/id/237/300/200',
            'https://fastly.picsum.photos/id/3/5000/3333.jpg?hmac=GDjZ2uNWE3V59PkdDaOzTOuV3tPWWxJSf4fNcxu4S2g',
            'https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4',
            'https://fastly.picsum.photos/id/2/5000/3333.jpg?hmac=_KDkqQVttXw_nM-RyJfLImIbafFrqLsuGO5YuHqD-qQ',
            'https://fastly.picsum.photos/id/3/5000/3333.jpg?hmac=GDjZ2uNWE3V59PkdDaOzTOuV3tPWWxJSf4fNcxu4S2g'
        ];

        const promises = urls.map(url =>
            this.fetchImageWithTimeout(url, this.TimeOut)
                .then(img => ({ status: 'fulfilled', img, url }))
                .catch(error => ({ status: 'rejected', error, url }))
        );

        const results = await Promise.all(promises);

        for (let i = 0; i < results.length; i++) {
            const result = results[i];

            if (result.status === 'fulfilled') {
                this.Tile.string = "Image loaded:";
                this.Body.string = result.url;

                let texture = new cc.Texture2D();
                texture.initWithElement(result.img);
                texture.handleLoadedTexture();

                let spriteFrame = new cc.SpriteFrame(texture);

                if (i < this.spriteArray.length) {
                    this.spriteArray[i].spriteFrame = spriteFrame;
                } else {
                    console.warn(`No sprite available for index ${i}`);
                }

            } else {
                this.Tile.string = "Error:";
                this.Body.string = result.error.message;
                console.error("Error loading image:", result.url, result.error);
            }
        }
    },

    start() {
        this.call();
    },
});