const BASE_URL = 'http://localhost:8000';

export const mapperApi = {
    // Хелпер для обработки ошибок
    handleResponse: async (response: Response) => {
        if (!response.ok) {
            // Пытаемся прочитать детали ошибки от сервера
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error details:', errorData); // <-- Это покажет, что не так
            throw new Error(errorData.detail?.[0]?.msg || 'API Request failed');
        }
        return response.json();
    },

    uploadAudio: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${BASE_URL}/api/upload`, { method: 'POST', body: formData });
        return mapperApi.handleResponse(response);
    },

    analyzeBPM: async (fileId: string) => {
        const params = new URLSearchParams({ file_id: fileId });
        const response = await fetch(`${BASE_URL}/api/analyze/bpm?${params}`);
        return mapperApi.handleResponse(response);
    },

    analyzeOnsets: async (fileId: string, threshold: number) => {
        const url = new URL(`${BASE_URL}/api/analyze/onsets`);

        url.searchParams.append('file_id', fileId);
        url.searchParams.append('threshold', threshold.toString());

        console.log("Sending request to:", url.toString());

        const response = await fetch(url.toString());
        return mapperApi.handleResponse(response);
    },

    analyzeOffset: async (onsets: number[]) => {
        const response = await fetch(`${BASE_URL}/api/analyze/offset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(onsets),
        });
        return mapperApi.handleResponse(response);
    },

    generateObjects: async (params: {
        file_id: string;
        onsets: number[];
        bpm: number;
        offset: number;
        grid_size: number;
        start_time: number;
        end_time: number | null;
    }) => {
        const response = await fetch(`${BASE_URL}/api/generate/objects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        return mapperApi.handleResponse(response);
    },


};