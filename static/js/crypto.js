/* ═══════════════════════════════════════
   crypto.js — Cryptographic utilities
   Uses Web Crypto API (built into browser)
   ═══════════════════════════════════════ */

const enc = s => new TextEncoder().encode(s);
const hex = buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
const toHex = n => n.toString(16).padStart(2, '0');

async function sha256(data) {
  const h = await crypto.subtle.digest('SHA-256', data instanceof Uint8Array ? data : enc(data));
  return new Uint8Array(h);
}

async function hmacSha256(keyStr, messageStr) {
  const keyData = enc(keyStr);
  const key = await crypto.subtle.importKey(
    'raw', keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc(messageStr));
  return hex(sig);
}

// Returns all intermediate step data for visualization
async function getStepData(keyStr, msgStr) {
  const keyBytes = enc(keyStr);
  const BLOCK_SIZE = 64;
  const IPAD_BYTE = 0x36;
  const OPAD_BYTE = 0x5C;

  // Step 1: Key normalization
  let kPrime = new Uint8Array(BLOCK_SIZE); // starts as zeros
  if (keyBytes.length > BLOCK_SIZE) {
    const hk = await sha256(keyBytes);
    kPrime.set(hk); // hash fills first 32 bytes, rest zero-padded
  } else {
    kPrime.set(keyBytes); // key fills first N bytes, rest zero-padded
  }

  const ipad = new Uint8Array(BLOCK_SIZE).fill(IPAD_BYTE);
  const opad = new Uint8Array(BLOCK_SIZE).fill(OPAD_BYTE);

  // Step 2: XOR with ipad
  const kIpad = kPrime.map((b, i) => b ^ ipad[i]);

  // Step 3: Inner hash — SHA-256(K'⊕ipad ∥ message)
  const innerInput = new Uint8Array([...kIpad, ...enc(msgStr)]);
  const innerHash = await sha256(innerInput);

  // Step 4: XOR with opad
  const kOpad = kPrime.map((b, i) => b ^ opad[i]);

  // Step 5: Outer hash — SHA-256(K'⊕opad ∥ innerHash)
  const outerInput = new Uint8Array([...kOpad, ...innerHash]);
  const outerHash = await sha256(outerInput);

  // Also compute plain SHA-256 of message for comparison
  const msgHash = await sha256(enc(msgStr));

  return {
    keyBytes, kPrime,
    ipad, opad,
    kIpad, kOpad,
    innerHash, outerHash,
    msgHash,
    IPAD_BYTE, OPAD_BYTE,
    keyStr, msgStr
  };
}

// Convert hex string to bit array [0,1,0,1,...]
function hexToBits(h) {
  return h.split('').flatMap(c => parseInt(c,16).toString(2).padStart(4,'0').split('').map(Number));
}

// Convert byte to binary string "00110110"
function byteToBin(b) {
  return b.toString(2).padStart(8, '0');
}

window.enc       = enc;
window.hex       = hex;
window.toHex     = toHex;
window.sha256    = sha256;
window.hmacSha256 = hmacSha256;
window.getStepData = getStepData;
window.hexToBits   = hexToBits;
window.byteToBin   = byteToBin;
