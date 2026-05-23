class XORCipher {
    static encrypt(plaintext, key) {
        if (!plaintext || !key) {
            throw new Error("Plaintext and/or key is empty");
        }
        const plaintextBytes = this.stringToBytes(plaintext);
        const keyBytes = this.stringToBytes(key);
        const encryptedBytes = this.xorBytes(plaintextBytes, keyBytes);
        return this.bytesToBase64(encryptedBytes);
    }
    static decrypt(ciphertext, key) {
        if (!ciphertext || !key) {
            throw new Error("Ciphertext and/or key is empty");
        }
        const ciphertextBytes = this.base64ToBytes(ciphertext);
        const keyBytes = this.stringToBytes(key);
        const plaintextBytes = this.xorBytes(ciphertextBytes, keyBytes);
        return this.bytesToString(plaintextBytes);
    }
    static stringToBytes(str) {
        const encoder = new TextEncoder();
        return encoder.encode(str);
    }
    static bytesToString(bytes) {
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    }
    static xorBytes(data, key) {
        const result = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
            result[i] = data[i] ^ key[i % key.length];
        }
        return result;
    }
    static bytesToBase64(bytes) {
        let binaryString = '';
        for (let i = 0; i < bytes.length; i++) {
            binaryString += String.fromCharCode(bytes[i]);
        }
        return btoa(binaryString);
    }
    static base64ToBytes(base64) {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }
}
function encrypt() {
    const plaintextEl = document.getElementById("textToEncryptInput");
    const keyEl = document.getElementById("encryptKeyInput");
    const outputEl = document.getElementById("encryptOutput");

    try {
        const plaintext = plaintextEl.value.trim();
        const key = keyEl.value.trim();

        if (!plaintext || !key) {
            outputEl.innerHTML = '<p style="color: red;">Error: Please enter both text and the key.</p>';
            return;
        }

        const encrypted = XORCipher.encrypt(plaintext, key);
        outputEl.innerHTML = `
            <h4>Result:</h4>
            <textarea readonly>${encrypted}</textarea>
            <button onclick="copyToClipboard('${encrypted.replace(/'/g, "\\'")}')">Copy to Clipboard</button>
        `;
        plaintextEl.setAttribute("data-status", "encrypted");
    } catch (error) {
        outputEl.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}
function decrypt() {
    const ciphertextEl = document.getElementById("encryptedTextInput");
    const keyEl = document.getElementById("decryptKeyInput");
    const outputEl = document.getElementById("decryptOutput");
    try {
        const ciphertext = ciphertextEl.value.trim();
        const key = keyEl.value.trim();
        if (!ciphertext || !key) {
            outputEl.innerHTML = '<p style="color: red;">Error: Please enter both encrypted text and the key.</p>';
            return;
        }
        const decrypted = XORCipher.decrypt(ciphertext, key);
        outputEl.innerHTML = `
            <h4>Result:</h4>
            <textarea readonly>${decrypted}</textarea>
            <button onclick="copyToClipboard('${decrypted.replace(/'/g, "\\'")}')">Copy to Clipboard</button>
        `;
        ciphertextEl.setAttribute("data-status", "decrypted");
    } catch (error) {
        outputEl.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Copied!");
    });
}
