const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Debug: Log API URL (remove after fixing)
if (typeof window !== 'undefined') {
    console.log('🔧 API_URL:', API_URL);
}

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // Debug logging
    console.log('🌐 Fetching:', `${API_URL}${url}`);

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

    // Debug response
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', response.headers);

    return response;
};
