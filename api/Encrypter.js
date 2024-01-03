const crypto = require('crypto');

const algorithm = "aes-128-cbc";
const secretKey = crypto.randomBytes(16); // TODO: Read from environment variable.
const initializationVector = crypto.randomBytes(16);

const cipher = crypto.createCipheriv(algorithm, secretKey, initializationVector);
const decipher = crypto.createDecipheriv(algorithm, secretKey, initializationVector);

class Encrypter {
    static encrypt(text) {
        cipher.write(text);
        return cipher.end();
    }

    static decrypt(text) {
        decipher.read(text)
        return decipher.read();
    }

    static getUUID() {
        return crypto.randomUUID();
    }
}


module.exports = Encrypter;
