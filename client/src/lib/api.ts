const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // Merge headers
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        credentials: 'include',
        headers
    });

    return response;
};
