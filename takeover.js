import {localStorage} from "./localstorage";

export function interceptSend(op, data) {
    if (op === 2 && localStorage.realToken) {
        data.token = localStorage.realToken;
    }
}

export function interceptReceive(op, data, type) {
    if (op === 0 && type === "READY" && data.user.bot) {
        delete data.user.bot;
        data.user.email = "fake@email";
        // don't deny admin permissions because mfa isn't enabled
        data.user.mfa_enabled = true;
        data.read_state = [];
        data.user_guild_settings = [];
        data.connected_accounts = [];
        data.experiments = [];
    }
}

// friendSuggestionCount: t.friend_suggestion_count,
// presences: t.presences || [],
// notes: t.notes,
// analyticsToken: t.analytics_token,
// experiments: t.experiments,
// connectedAccounts: t.connected_accounts,
// guildExperiments: t.guild_experiments
