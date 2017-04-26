import {createMagicSubclass, MagicProxy} from "./magic";
import {interceptSend, interceptReceive} from "./takeover";
import {localStorage} from "./localstorage";
import pako from "pako";

window.XMLHttpRequest = createMagicSubclass(window.XMLHttpRequest, {
    setRequestHeader: function(name, value) {
        if (name.toLowerCase() === 'authorization' && localStorage.realToken) {
            value = localStorage.realToken;
        }
        this.setRequestHeader(name, value);
    }
});

// etf not supported. duh.
function decodeFrame(frame) {
    if (frame instanceof ArrayBuffer) {
        frame = pako.inflate(new Uint8Array(frame), {to: "string"});
    }
    return JSON.parse(frame);
}

window.WebSocket = createMagicSubclass(window.WebSocket, {
    onmessage: {
        get: function() {
            return this._onmessage;
        },
        set: function(handler) {
            this._onmessage = handler;
        }
    },

    send: function(frame) {
        frame = decodeFrame(frame);
        interceptSend(frame.op, frame.d);
        console.log("sending");
        console.log(frame);
        this.send(JSON.stringify(frame));
    },
}, function WebSocket() {
    var _this = this;
    this._.onmessage = function(e) {
        var frame = e.data;
        frame = decodeFrame(frame);
        interceptReceive(frame.op, frame.d, frame.t);
        console.log("receiving");
        console.log(frame);
        e = new MagicProxy(e, {
            data: {get: function() {
                return JSON.stringify(frame);
            }}
        });
        return _this._onmessage(e);
    }
    this._onmessage = null;
});
