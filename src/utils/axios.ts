export const myhttp = (options: {
    method?: 'get' | 'post',
    url: string,
    data?: {
        [key: string]: any
    },
    params?: {
        [key: string]: any
    },
}) => {
    const method = (options.method || 'get').toUpperCase();
    const url = new URL(options.url, window.location.origin);
    const params = options.params || {};
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, String(params[key]));
        }
    });
    const fetchOptions: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (method === 'POST') {
        fetchOptions.body = JSON.stringify(options.data || {});
    }
    return fetch(url.toString(), fetchOptions)
        .then(async (res) => {
            const contentType = res.headers.get('content-type') || '';
            const data = contentType.includes('application/json') ? await res.json() : await res.text();
            if (!res.ok) {
                return Promise.reject({ status: res.status, data });
            }
            return data;
        });
}