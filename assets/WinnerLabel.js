cc.Class({
    extends: cc.Component,

    properties: {
        anim: cc.Animation,
        label: cc.Label
    },

    // use this for initialization
    init (num) {
        this.label.string = num.toString();
        this.anim.play('appear');
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
