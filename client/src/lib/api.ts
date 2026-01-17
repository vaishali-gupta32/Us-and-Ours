const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // Get token from localStorage for cross-domain auth
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    // Merge headers - add Authorization if token exists
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...(options.headers || {})
    };

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        credentials: 'include',
        headers
    });

    return response;
};
