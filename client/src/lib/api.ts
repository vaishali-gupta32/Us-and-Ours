const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Debug: Log API URL (remove after fixing)
if (typeof window !== 'undefined') {
    console.log('🔧 API_URL:', API_URL);
}

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // Debug logging
    console.log('🌐 Fetching:', `${API_URL}${url}`);

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

    // Debug response
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', response.headers);

    return response;
};
