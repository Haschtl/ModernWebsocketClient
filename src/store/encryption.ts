
import * as CryptoJS from 'crypto-js';
var crypto = require('crypto');

export function encryptJSON(message: Object, password: string) {
    if (password === '') {
        return JSON.stringify(message)
    }
    else {
        var retmsg = JSON.stringify(message)
        retmsg = encryptStr(retmsg, password)
        return retmsg
    }
}

export function decryptJSON(message: string, password: string) {
    if (password === '') {
        const retJSON: Object = JSON.parse(message)
        return retJSON
    }
    else {
        var ans = decryptStr(message, password)
        if (ans !== false) {
            const retJSON: Object = JSON.parse(ans)
            return retJSON
        }
        else {
            return undefined
        }
    }
}

export function hashPassword(key: string, full: boolean = false) {
    var hash = crypto.createHash("sha256").update(key, 'utf8').digest('base64')
    if (hash === undefined) {
        return false
    }
    if (full === false) {
        hash = hash.slice(0, 16)
    }
    return hash
}
export function encryptStr(msgString: string, key: string) {
    var secret_key = hashPassword(key)
    secret_key = CryptoJS.enc.Utf8.parse(secret_key);

    var iv = CryptoJS.lib.WordArray.random(16);
    var encrypted = CryptoJS.AES.encrypt(msgString, secret_key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    var msg = CryptoJS.enc.Base64.stringify(iv.concat(encrypted.ciphertext))
    return msg
}

export function decryptStr(message: string, key: string) {
    try {
        var secret_key = hashPassword(key)
        secret_key = CryptoJS.enc.Utf8.parse(secret_key);

        var ciphertext = CryptoJS.enc.Base64.parse(message);
        var iv = ciphertext.clone();
        iv.sigBytes = 16;
        iv.clamp();

        ciphertext.words.splice(0, 4);
        ciphertext.sigBytes -= 16;

        var decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext, iv: iv, salt: '' }, secret_key, {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
    catch (e) {
        console.error(e)
        return false
    }

}

export function pad(text: string, padding: number = 16) {
    while (text.length % padding !== 0) {
        text += ' '
    }
    return text
}

// function testEncryption() {
//     console.log('Test-Encryption:')
//       var pass = 'geheim'
//       var msg = {Wow: true}
//       var enc = encryptJSON(msg, pass)
//       console.log(enc)
//       var dec = decryptJSON(enc, pass)
//       if ( JSON.stringify(msg) !==  JSON.stringify(dec)) {
//         console.error('LOCAL ENCRYPTION FAILED')
//       }
//       else {
//         console.info('LOCAL ENCRYPTION OK')
//       }

// }