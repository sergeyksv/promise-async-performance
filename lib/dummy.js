// A typical node callback function
// with the callback at the Nth position
exports.dummy = function dummy(n) {
    return function dummy_n() {
        var cb = arguments[n - 1] || function(){};
        if (global.asyncTime)
            setTimeout(cb, global.asyncTime || 100);
        else
            process.nextTick(cb);
    }
}

exports.dummyp = function dummyp(n) {
    return function dummy_n() {
        return new Promise(function (resolve, reject) {
            if (global.asyncTime)
                setTimeout(resolve, global.asyncTime || 100);
            else
                process.nextTick(resolve);
        });
    }
}

// A throwing callback function
exports.dummyt = function dummyt(n) {
    return function dummy_throwing_n() {
        var cb = arguments[n - 1];
        if (global.testThrow)
            throw(new Error("Exception happened"));
        setTimeout(function throwTimeout() {
            if (global.testThrowAsync) {
                throw(new Error("Exception happened"));
            } else if (global.testError) {
                return cb(new Error("Error happened"));
            }
            else cb();
        }, global.asyncTime || 100);
    }
}

// A throwing callback function
exports.dummytp = function dummytp(n) {
    return function dummy_throwing_n() {
        var cb = arguments[n - 1];
        if (global.testThrow)
            throw(new Error("Exception happened"));
        return new Promise(function(resolve,reject){
            setTimeout(function throwTimeout() {
                if (global.testThrowAsync) {
                    throw(new Error("Exception happened"));
                } else if (global.testError) {
                    return reject(new Error("Error happened"));
                }
                else resolve();
            }, global.asyncTime || 100);
        });

    }
}


