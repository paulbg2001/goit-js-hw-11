const URL = 'https://pixabay.com/api/';
const API_KEY = '40876649-e14b6ea7b41694cd36b83fc87';

async function fetchImages({ searchQuery, page }) {
    return await axios.get(URL, {
        params: {
            key: API_KEY,
            q: `${searchQuery}`,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: `${page}`,
            per_page: 40,
        },
    });

}

export { fetchImages };