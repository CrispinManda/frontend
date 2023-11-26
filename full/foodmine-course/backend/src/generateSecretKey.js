const crypto = require('crypto');
const keyLengthInBytes = 32; // 32 bytes = 256 bits (a common choice)
const secretKey = crypto.randomBytes(keyLengthInBytes).toString('hex');
console.log('Secret Key:', secretKey);

