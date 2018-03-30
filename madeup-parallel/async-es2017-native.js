global.useNative = true;
require('../lib/fakesp1');

module.exports = async function upload(stream, idOrPath, tag, done) {
    var queries = new Array(global.parallelQueries);
    var tx = db.begin();

    for( var i = 0, len = queries.length; i < len; ++i ) {
        queries[i] = FileVersion.insert({index: i}).execWithin(tx);
    }

    try {
        await Promise.all(queries);
        tx.commit();
        done();
    }
    catch(e) {
        tx.rollback();
        done(e);
    }
}
