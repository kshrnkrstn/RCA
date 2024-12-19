
document.getElementById("generateKeys").addEventListener("click", () => {
    const keys = generateKeys();
    document.getElementById("keys").innerText = `Public Key: ${keys.publicKey}\nPrivate Key: ${keys.privateKey}`;
});

document.getElementById("encrypt").addEventListener("click", () => {
    const text = document.getElementById("inputText").value;
    const publicKey = getKey("public");
    const encrypted = encrypt(text, publicKey);
    document.getElementById("encryptedText").value = encrypted;
});

document.getElementById("decrypt").addEventListener("click", () => {
    const text = document.getElementById("decryptText").value;
    const privateKey = getKey("private");
    const decrypted = decrypt(text, privateKey);
    document.getElementById("decryptedText").value = decrypted;
});

function generateKeys() {
    const p = generatePrime(100, 500);
    const q = generatePrime(100, 500);
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    const e = getE(phi);
    const d = modInverse(e, phi);
    return {
        publicKey: `${n},${e}`,
        privateKey: `${n},${d}`
    };
}

function encrypt(text, publicKey) {
    const [n, e] = publicKey.split(",").map(Number);
    return text.split("").map(char => modExp(char.charCodeAt(0), e, n)).join(",");
}

function decrypt(text, privateKey) {
    const [n, d] = privateKey.split(",").map(Number);
    return text.split(",").map(char => String.fromCharCode(modExp(Number(char), d, n))).join("");
}

function generatePrime(min, max) {
    while (true) {
        const num = Math.floor(Math.random() * (max - min)) + min;
        if (isPrime(num)) return num;
    }
}

function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

function getE(phi) {
    for (let e = 3; e < phi; e += 2) {
        if (gcd(e, phi) === 1) return e;
    }
    return 3;
}

function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

function modInverse(e, phi) {
    let d = 1;
    while ((d * e) % phi !== 1) d++;
    return d;
}

function modExp(base, exp, mod) {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 === 1) result = (result * base) % mod;
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }
    return result;
}

function getKey(type) {
    const keys = document.getElementById("keys").innerText.split("\n");
    return type === "public" ? keys[0].split(": ")[1] : keys[1].split(": ")[1];
}
