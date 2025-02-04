export const fetchAPI = async (
    domain: string,
    path: string,
    headers: HeadersInit,
    data?: string
) => {
    const response = await fetch(`https://${domain}${path}`, {
        method: data ? "POST" : "GET",
        headers,
        body: data,
    });

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.statusText}`);
    }

    return await response.json();
};