const base64urlUnescape = (str: string) =>
    (str.length % 4 ? `${str}${"=".repeat(4 - (str.length % 4))}` : str)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

export const decodeJWT = (token: string) =>
    JSON.parse(atob(base64urlUnescape(token.split(".")[1])));