

var fakemaker = require('./fakemaker'),
    f = require('./dummy');

fakemaker(f.dummyp, f.dummytp, function wrap_identity(f) { return f; });


