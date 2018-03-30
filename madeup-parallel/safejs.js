require('../lib/fakes');
var safe = require("safe");

module.exports = function upload(stream, idOrPath, tag, done) {
    var tx = db.begin();
    var current = 0;
    var total = global.parallelQueries;

    function cb() {
        tx.rollback();
        done(err);      
    }


    for( var i = 0; i < total; ++i ) {
        FileVersion.insert({index: i}).execWithin(tx, safe.sure(cb, function onComplete() {
            if (onComplete.called) return;
            onComplete.called = true;
            current++;
            if( current === total ) {
                tx.commit();
                done();
            }
        }));
    }
}
