cc.Class({
    extends: cc.Component,

    properties: {
        numberPrefab: cc.Prefab,
        digits: 0,
        delayPerDigits: 0,
        layout: cc.Layout // should be right to left horizontal
    },

    // use this for initialization
    init (game) {
        this.numbers = []; // [NumberDisplay]
        this.game = game;
        for (let i = 0; i < this.digits; ++i) {
            let number = cc.instantiate(this.numberPrefab);
            this.numbers.push(number.getComponent('NumberDisplay'));
            this.layout.node.addChild(number);
            number.setPositionY = 0;
        }
    },

    startRolling () {
        for (let i = 0; i < this.digits; ++i) {
            this.startRollSingleDigit(i);
        }
    },

    startRollSingleDigit (idx) {
        this.scheduleOnce( function () {
            this.numbers[idx].startRolling();
        }.bind(this), this.delayPerDigits * (idx + 1));
    },

    showResult (result) {
        let resultArr = result.toString();
        for (let i = this.digits - 1; i >= 0; --i) {
            let curNum = '';
            if (i < resultArr.length) {
                curNum = resultArr[resultArr.length - i - 1];
            } else {
                curNum = '0';
            }
            this.showResultSingleDigit(i, curNum);
        }
    },

    showResultSingleDigit (idx, curNum) {
        this.scheduleOnce(function() {
            this.numbers[idx].showNumber(curNum);
            if (idx === 0) {
                this.game.finishResult();
            }
        }.bind(this), this.delayPerDigits * (this.digits - idx));
    },

    reset () {
        for (let i = 0; i < this.digits; ++i) {
            this.numbers[i].showNumber(0);
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
