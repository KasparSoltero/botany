document.addEventListener('DOMContentLoaded', () => {
    const topicTitles = document.querySelectorAll('.topic-title');

    topicTitles.forEach(title => {
        title.addEventListener('click', async () => {
            const content = title.nextElementSibling;
            const topicFolder = title.parentElement.dataset.topic;

            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
                if (content.innerHTML === '') {
                    const markdown = await fetchMarkdown(topicFolder);
                    content.innerHTML = marked.parse(markdown);
                }
            }
        });
    });
});

async function fetchMarkdown(topicFolder) {
    try {
        const response = await fetch(`topics/${topicFolder}/content.md`);
        if (!response.ok) {
            throw new Error('Failed to fetch markdown content');
        }
        return await response.text();
    } catch (error) {
        console.error('Error fetching markdown:', error);
        return '**Error loading content**';
    }
}