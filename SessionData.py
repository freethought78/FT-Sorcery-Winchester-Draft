import base64

def xor_encrypt(ip, key="secretkey"):
    return ''.join(chr(ord(c) ^ ord(key[i % len(key)])) for i, c in enumerate(ip))

def encrypt(ip) -> str:
    encrypted = xor_encrypt(ip)
    return base64.urlsafe_b64encode(encrypted.encode()).decode()
