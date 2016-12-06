function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label,
        interval: 0
    },

    // use this for initialization
    onLoad () {
        this.label.string = '0';
    },

    startRolling () {
        this.schedule(this.updateDisplay, this.interval, this);
    },

    updateDisplay () {
        let randomNum = getRandomInt(0, 10);
        if (randomNum === this.lastNum) {
            randomNum += 1;
            if (randomNum >= 10) {
                randomNum = 0;
            }
        }
        this.label.string = randomNum.toString();
        this.lastNum = randomNum;
    },

    stopRolling () {
        this.unschedule(this.updateDisplay, this);
    },

    showNumber (num) {
        this.stopRolling();
        if (num >= 10) {
            cc.log('invalid result!');
            return;
        }
        this.label.string = Math.floor(num).toString();
    }
});
