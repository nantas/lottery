const NumberManager = require('NumberManager');
const State = cc.Enum({
    Setup: -1,
    ReadyToRoll: -1,
    Rolling: -1
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


cc.Class({
    extends: cc.Component,

    properties: {
        numberMng: NumberManager,
        btnStart: cc.Button,
        sizeInput: cc.EditBox,
        startInput: cc.EditBox,
        winnerLayout: cc.Layout,
        winnerPrefab: cc.Prefab,
        instruction: cc.RichText,
        state: {
            get () {
                return this._state;
            },
            set (val) {
                if (this._state !== val) {
                    this._state = val;
                    this.updateState(val);
                }
            },
            visible: false
        }
    },

    // use this for initialization
    onLoad () {
        this.size = null; // the size of the candidate pool
        this.startIdx = null;
        this.pool = []; // candidate pool
        this.winner = -1;
        this.state = State.Setup;
        this.numberMng.init(this);
    },

    btnStartClick () {
        if (this.state === State.ReadyToRoll) {
            this.state = State.Rolling;
            this.numberMng.startRolling();
            this.scheduleOnce(this.showResult, this.numberMng.digits * this.numberMng.delayPerDigits + 2, this);
        }
    },

    showResult () {
        let winnerIdx = getRandomInt(0, this.pool.length);
        this.winner = this.pool[winnerIdx];
        this.numberMng.showResult(this.winner);
        this.pool.splice(winnerIdx, 1);
    },

    finishResult () {
        let winner = cc.instantiate(this.winnerPrefab);
        winner.getComponent('WinnerLabel').init(this.winner);
        this.winnerLayout.node.addChild(winner);
        this.state = State.ReadyToRoll;
    },

    updateSize (editBox) {
        let input = 0;
        try {
            input = parseInt(editBox.string);
        } 
        catch (e) {
            editBox.string = 'invalid';
            return;
        }
        this.size = input;
        if ((typeof this.startIdx) === "number" && !Number.isNaN(this.startIdx)) {
            this.state = State.ReadyToRoll;
        }
        this.startInput.setFocus();
    },

    generatePool () {
        this.pool = [];
        for (let i = 0; i < this.size; ++i) {
            this.pool.push(this.startIdx + i);
        }
    },

    updateStartIdx (editBox) {
        let input = 0;
        try {
            input = parseInt(editBox.string);
        } 
        catch (e) {
            editBox.string = 'invalid';
            return;
        }
        this.startIdx = input;
        if ((typeof this.size) === "number" && !Number.isNaN(this.size)) {
            this.state = State.ReadyToRoll;       
        }
    },

    updateState (state) {
        switch (state) {
            case State.Setup:
                this.sizeInput.maxLength = 8;
                this.sizeInput.string = '';
                this.btnStart.interactable = false;
                this.instruction.string = '请输入参与抽奖人数和开始序号，如需重新输入请按复位按钮';
                break;
            case State.ReadyToRoll:
                this.sizeInput.maxLength = 0;
                this.btnStart.interactable = true;
                this.instruction.string = '本次抽奖参与者共 <color=green>' + this.size + '</color> 人，开始序号为<color=blue> ' + this.startIdx + ' </color>';
                this.generatePool();
                break;
            case State.Rolling:
                this.sizeInput.maxLength = 0;
                this.btnStart.interactable = false;
                break;
        }
    },

    reset () {
        this.state = State.Setup;
        this.size = null;
        this.startIdx = null;
        this.sizeInput.string = '';
        this.startInput.string = '';
        this.winner = -1;
        this.numberMng.reset();
        let winnerNums = this.winnerLayout.node.children;
        for (let i = 0; i < winnerNums.length; ++i) {
            winnerNums[i].destroy();
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
