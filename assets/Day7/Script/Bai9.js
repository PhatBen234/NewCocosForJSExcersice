cc.Class({
    extends: cc.Component,

    properties: {
    outputLabel: cc.Label,
    },

    start() {
    this.testCircuitBreaker();
    },

    async getServerTime() {
    try {
        const response = await fetch(window.location.href.toString(), { method: 'HEAD' });
        const dateHeader = response.headers.get('Date');
        if (!dateHeader) throw new Error('No Date header');
        return new Date(dateHeader).getTime();
    } catch (e) {
        return Date.now(); // fallback
    }
    },

    async circuitBreaker(fn, timeThreshold) {
    let isOpen = true;
    setTimeout(() => {
        isOpen = false;
    }, timeThreshold);

    return async (...args) => {
        if (isOpen) {
        return await fn(...args);
        } else {
        return "service closed";
        }
    };
    },

    async testCircuitBreaker() {
    const getTimeLimited = await this.circuitBreaker(this.getServerTime, 2000);

    setTimeout(async () => {
        const result1 = await getTimeLimited();
        cc.log(result1);
        this.outputLabel.string = 'KQ 1: ' + result1;
    }, 300);

    setTimeout(async () => {
        const result2 = await getTimeLimited();
        cc.log(result2);
        this.outputLabel.string += '\nKQ 2: ' + result2;
    }, 2100);
    }

});
