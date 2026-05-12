import hmac
import hashlib
import json


# ── helpers ───────────────────────────────────────────────────────────────────

def _to_bytes(value: str) -> bytes:
    """Encode a string to UTF-8 bytes."""
    return value.encode("utf-8")


def _hex(b: bytes) -> str:
    return b.hex()


def _xor_bytes(a: bytes, b: bytes) -> bytes:
    return bytes(x ^ y for x, y in zip(a, b))


# ── core HMAC computation ─────────────────────────────────────────────────────

BLOCK_SIZE = 64   # SHA-256 block size in bytes
IPAD = b"\x36" * BLOCK_SIZE
OPAD = b"\x5c" * BLOCK_SIZE


def compute_hmac(message: str, secret_key: str) -> str:
    """Return hex-encoded HMAC-SHA-256."""
    h = hmac.new(_to_bytes(secret_key), _to_bytes(message), hashlib.sha256)
    return h.hexdigest()


def verify_hmac(message: str, secret_key: str, expected: str) -> bool:
    """Constant-time HMAC comparison."""
    computed = compute_hmac(message, secret_key)
    return hmac.compare_digest(computed, expected.lower())


# ── step-by-step breakdown ────────────────────────────────────────────────────

def compute_steps(message: str, secret_key: str) -> list:
    """
    Return a list of dicts describing each HMAC-SHA-256 step.
    All byte sequences are hex-encoded for JSON transport.
    """
    key_bytes = _to_bytes(secret_key)
    msg_bytes = _to_bytes(message)

    # Step 1 – key preparation
    if len(key_bytes) > BLOCK_SIZE:
        prepared_key = hashlib.sha256(key_bytes).digest()
    else:
        prepared_key = key_bytes

    padded_key = prepared_key.ljust(BLOCK_SIZE, b"\x00")

    # Step 2 – inner padding
    inner_key = _xor_bytes(padded_key, IPAD)

    # Step 3 – inner hash
    inner_input = inner_key + msg_bytes
    inner_hash = hashlib.sha256(inner_input).digest()

    # Step 4 – outer padding
    outer_key = _xor_bytes(padded_key, OPAD)

    # Step 5 – outer hash (final HMAC)
    outer_input = outer_key + inner_hash
    final_hmac = hashlib.sha256(outer_input).digest()

    return [
        {
            "step": 1,
            "title": "Key Preparation",
            "title_ru": "Подготовка ключа",
            "description": (
                "If the key is longer than 64 bytes it is hashed with SHA-256; "
                "otherwise it is zero-padded to exactly 64 bytes."
            ),
            "description_ru": (
                "Если ключ длиннее 64 байт — хешируем SHA-256; "
                "иначе дополняем нулями до 64 байт."
            ),
            "input_key_hex": _hex(key_bytes),
            "input_key_length": len(key_bytes),
            "prepared_key_hex": _hex(prepared_key),
            "padded_key_hex": _hex(padded_key),
        },
        {
            "step": 2,
            "title": "Inner Key XOR with ipad (0x36)",
            "title_ru": "XOR ключа с ipad (0x36)",
            "description": "XOR the padded key with the inner-padding constant 0x36 repeated 64 times.",
            "description_ru": "Выполняем XOR дополненного ключа с константой ipad (0x36, 64 раза).",
            "padded_key_hex": _hex(padded_key),
            "ipad_hex": _hex(IPAD),
            "inner_key_hex": _hex(inner_key),
        },
        {
            "step": 3,
            "title": "Inner SHA-256 Hash",
            "title_ru": "Внутренний хеш SHA-256",
            "description": "Concatenate inner_key ∥ message, then apply SHA-256.",
            "description_ru": "Конкатенируем inner_key ∥ сообщение и применяем SHA-256.",
            "inner_key_hex": _hex(inner_key),
            "message_hex": _hex(msg_bytes),
            "inner_input_length": len(inner_input),
            "inner_hash_hex": _hex(inner_hash),
        },
        {
            "step": 4,
            "title": "Outer Key XOR with opad (0x5C)",
            "title_ru": "XOR ключа с opad (0x5C)",
            "description": "XOR the padded key with the outer-padding constant 0x5C repeated 64 times.",
            "description_ru": "Выполняем XOR дополненного ключа с константой opad (0x5C, 64 раза).",
            "padded_key_hex": _hex(padded_key),
            "opad_hex": _hex(OPAD),
            "outer_key_hex": _hex(outer_key),
        },
        {
            "step": 5,
            "title": "Final HMAC-SHA-256",
            "title_ru": "Финальный HMAC-SHA-256",
            "description": "Concatenate outer_key ∥ inner_hash, then apply SHA-256 to get the HMAC.",
            "description_ru": "Конкатенируем outer_key ∥ inner_hash и применяем SHA-256 — получаем HMAC.",
            "outer_key_hex": _hex(outer_key),
            "inner_hash_hex": _hex(inner_hash),
            "final_hmac_hex": _hex(final_hmac),
        },
    ]


# ── RFC 2104 test vector ──────────────────────────────────────────────────────

RFC_TEST_VECTOR = {
    "key": "key",
    "message": "The quick brown fox jumps over the lazy dog",
    "expected_hmac": "f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8",
}
