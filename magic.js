export function MagicProxy(obj, proxies) {
    return new Proxy(obj, {
        get: function(target, name) {
            if (name === "_") {
                return target;
            }
            if (name in proxies) {
                var proxy = proxies[name];
                if (typeof(proxy) === "function") {
                    return proxy.bind(target);
                } else {
                    return proxy.get.call(target);
                }
            }
            var result = target[name];
            if (typeof(result) === "function") {
                return function() {
                    return result.apply(target, arguments);
                }
            }
            return result;
        },
        set: function(target, name, value) {
            if (name in proxies) {
                var proxy = proxies[name];
                if (typeof(proxy) !== "function") {
                    proxy.set.call(target, value);
                } else {
                    return false;
                }
            } else {
                target[name] = value;
            }
            return true;
        }
    });
}

export function createMagicSubclass(Cls, proxies, ctor) {
    return function(a,b,c) {
        var proxy = new MagicProxy(new Cls(a,b,c), proxies);
        if (typeof(ctor) !== "undefined") {
            ctor.apply(proxy, arguments);
        }
        return proxy;
    };
}
