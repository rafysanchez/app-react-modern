function base64UrlDecode(str: string) {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      throw new Error('Illegal base64url string!');
  }
  return atob(output);
}

export function decodeJwt<T>(token: string): T | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT: The token must have 3 parts');
    }
    const payload = parts[1];
    const decodedPayload = base64UrlDecode(payload);
    return JSON.parse(decodedPayload) as T;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}