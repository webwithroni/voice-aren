# Security Policy

## Reporting Security Issues

Do not publicly disclose security vulnerabilities before they can be investigated.

## Secrets

AREN must never commit:

- Gemini API keys
- OAuth credentials
- Signing keys
- Keystore passwords
- Firebase credentials
- Personal access tokens

Use environment variables, local secret storage, or the appropriate Android secret-management mechanism.

## Runtime Trust

AREN must never claim an action completed unless the underlying system confirms completion.
