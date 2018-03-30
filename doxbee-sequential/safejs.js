require('../lib/fakes');
var safe = require("safe");

module.exports = function upload(stream, idOrPath, tag, done) {
    var blob = blobManager.create(account);
    var tx = db.begin();
    function backoff(err) {
        tx.rollback();
        return done(err);
    }
    blob.put(stream, safe.sure(done, function (blobId) {
        self.byUuidOrPath(idOrPath).get(safe.sure(done, function (file) {
            var previousId = file ? file.version : null;
            var version = {
                userAccountId: userAccount.id,
                date: new Date(),
                blobId: blobId,
                creatorId: userAccount.id,
                previousId: previousId,
            };
            version.id = Version.createHash(version);
            Version.insert(version).execWithin(tx, safe.sure(backoff,function () {
                if (!file) {
                    var splitPath = idOrPath.split('/');
                    var fileName = splitPath[splitPath.length - 1];
                    var newId = uuid.v1();
                    self.createQuery(idOrPath, {
                        id: newId,
                        userAccountId: userAccount.id,
                        name: fileName,
                        version: version.id
                    }, safe.sure(backoff, function (q) {
                        q.execWithin(tx, safe.sure(backoff, function () {
                            afterFileExists(newId);
                        }));
                    }))
                }
                else return afterFileExists(null, file.id);
            }));
            function afterFileExists(fileId) {
                FileVersion.insert({fileId: fileId,versionId: version.id})
                    .execWithin(tx, safe.sure(backoff, function (err) {
                        File.whereUpdate({id: fileId}, {
                            version: version.id
                        }).execWithin(tx, safe.sure(backoff, function () {
                            tx.commit(done);
                        }));
                }))
            }
        }));
    }));
}
