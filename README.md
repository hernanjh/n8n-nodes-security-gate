# n8n-nodes-security-gate

This is an n8n community node that validates an input value against a secure token stored in credentials. It acts as a logic gate with two outputs: **Valid** and **Invalid**.

## Features

- **Secure Validation**: Compare sensitive values (like API keys or secrets) without exposing them in the workflow execution data.
- **Dual Outputs**: Route your workflow based on whether the validation succeeded or failed.
- **Metadata Support**: Maintains `pairedItem` information for proper data lineage.

## Installation

Follow the installation guide in the [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/installation/).

For local development:

```bash
npm install
npm run build
npm link
```

## Credentials

### Security Token

Store your secret key in the **Security Token** credential.

- **Token**: The secret string against which the input will be compared.

## Usage

### Parameters

- **Value to Validate**: The expression or string to compare (e.g., `{{ $json.headers["x-api-key"] }}`).

### Outputs

1. **Valid (Top)**: Items that strictly match (===) the credential token.
2. **Invalid (Bottom)**: Items that do not match or where an error occurred during validation.

## License

[MIT](LICENSE)
