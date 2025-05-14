cc.Class({
    extends: cc.Component,

    properties: {
        resultLabel: cc.Label,
    },

    onLoad() {
        const URL = 'https://jsonplaceholder.typicode.com/posts/1'; // URL api
        const TIMEOUT = 3000; // neu chuyen qua 1 se bi request timeout ngay, o day la 3s

        this.fetchDataWithTimeout(URL, TIMEOUT) // goi ham de fetch kem timeout
            .then(data => {
                this.resultLabel.string = `✅ Title:\n${data.title}\n\n📝 Body:\n${data.body}`;// rq thanh cong thi tra ket qua
            })
            .catch(error => {
                this.resultLabel.string = `❌ Error: ${error.message}`;// bat va hien thi loi neu co loi
            });
    },

    fetchDataWithTimeout(url, timeout) { //day chinh la ham fetch co time out nhu da noi o tren
        return new Promise((resolve, reject) => { // resolve la trang thai thanh cong, reject la trang thai loi
            const controller = new AbortController(); // tao controller de cancel rq neu can
            const signal = controller.signal; //lay signal truyen vao fetch
            //tao timer timeout
            const timer = setTimeout(() => {
                controller.abort(); //huy rq neu qua thoi gian
                reject(new Error("⏰ Request timed out")); //tra ve loi~
            }, timeout);
            //thuc hien rq vs fetch api
            fetch(url, { signal })
                .then(response => {
                    clearTimeout(timer); // neu co res roi thi khong can timeout nua
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`); // neu k phai ma~ 200ms thi nem' loi~
                    }
                    return response.json(); // parse JSON res
                })
                .then(data => resolve(data)) // tra ket qua ra ngoai
                .catch(err => {
                    if (err.name === "AbortError") {// thong bao ro loi do time out
                        reject(new Error("Request aborted due to timeout"));
                    } else {
                        reject(err);// cac loi khac
                    }
                });
        });
    },
});

//FLOW
//User gọi fetchDataWithTimeout(url, timeout)
//                │
//                ▼
// ┌────────────────────────────────────────┐
// │ Tạo AbortController + signal           │
// └────────────────────────────────────────┘
//                │
//                ▼
// ┌────────────────────────────────────────┐
// │ setTimeout sau `timeout` ms            │
// │   └──> nếu hết giờ: controller.abort() │
// │                  reject("timeout")     │
// └────────────────────────────────────────┘
//                │
//                ▼
// ┌────────────────────────────────────────┐
// │ fetch(url, { signal })                 │
// └────────────────────────────────────────┘
//                │
//                ├──> Nếu response về trước khi timeout:
//                │        └── clearTimeout
//                │        └── resolve(data)
//                │
//                └──> Nếu bị timeout (bị abort):
//                         └── catch -> kiểm tra lỗi
//                         └── reject("Request aborted...")
