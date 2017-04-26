import {localStorage} from "./localstorage";

export function interceptSend(op, data) {
    if (op === 2 && localStorage.realToken) {
        data.token = localStorage.realToken;
    }
}

export function interceptReceive(op, data, type) {
    if (op === 0 && type === "READY" && data.user.bot) {
        delete data.user.bot;
        data.read_state = [];
        data.user_guild_settings = [];
        data.tutorial = null;
        data.friend_suggestion_count = 0;
        data.notes = [];
        data.connected_accounts = [];
    }
}
