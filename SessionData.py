import base64

def xor_encrypt(data, key):
    return ''.join(chr(ord(c) ^ ord(key[i % len(key)])) for i, c in enumerate(data))

def encrypt(data, key) -> str:
    encrypted = xor_encrypt(data, key)
    return base64.urlsafe_b64encode(encrypted.encode()).decode()
