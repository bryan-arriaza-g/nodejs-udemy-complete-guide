const path = require('path');

// module.exports = path.dirname(process.mainModule.filename); @deprecated 14.0.0
module.exports = path.dirname(require.main.filename);
