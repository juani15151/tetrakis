const crypto = require('crypto');

const algorithm = "aes-128-cbc";
const secretKey = crypto.randomBytes(16); // TODO: Read from environment variable.
const initializationVector = crypto.randomBytes(16);

class Encrypter {
    static encrypt(text) {
        const cipher = crypto.createCipheriv(algorithm, secretKey, initializationVector);
        cipher.update(text);
        return cipher.final().toString('hex');
    }

    static decrypt(text) {
        const decipher = crypto.createDecipheriv(algorithm, secretKey, initializationVector);
        decipher.update(text, 'hex')
        return decipher.final().toString();
    }

    static getUUID() {
        return crypto.randomUUID();
    }
}


module.exports = Encrypter;
