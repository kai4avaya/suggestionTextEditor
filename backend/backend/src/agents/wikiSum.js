
export async function getWikipediaSummary(topic) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.type === 'standard') {
            return data.extract;
        } else {
            return 'No summary available.';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return 'No summary available.';
    }
}