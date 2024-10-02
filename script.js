document.addEventListener('DOMContentLoaded', async () => {
    const topicList = document.getElementById('topic-list');
    
    try {
        const response = await fetch('topics.json');
        if (!response.ok) {
            throw new Error('Failed to fetch topics');
        }
        const data = await response.json();
        
        data.topics.forEach(topic => {
            const li = document.createElement('li');
            li.dataset.topic = topic;
            li.innerHTML = `
                <h2 class="topic-title">${topic.charAt(0).toUpperCase() + topic.slice(1)}</h2>
                <div class="topic-content"></div>
            `;
            topicList.appendChild(li);
        });
        
        addClickListeners();
    } catch (error) {
        console.error('Error fetching topics:', error);
        topicList.innerHTML = '<li>Error loading topics</li>';
    }
});

function addClickListeners() {
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
}

function encodeTopicFolder(folder) {
    return folder.split(' ').map(encodeURIComponent).join('%20');
}

function processMarkdownImages(markdown, topicFolder) {
    const encodedFolder = encodeTopicFolder(topicFolder);
    return markdown.replace(
        /!\[(.*?)\]\((.*?)\)/g,
        (match, alt, src) => {
            if (!src.startsWith('http') && !src.startsWith('/')) {
                src = `/topics/${encodedFolder}/${encodeURIComponent(src)}`;
            }
            return `![${alt}](${src})`;
        }
    );
}

async function fetchMarkdown(topicFolder) {
    try {
        const encodedFolder = encodeTopicFolder(topicFolder);
        const response = await fetch(`topics/${encodedFolder}/content.md`);
        if (!response.ok) {
            throw new Error('Failed to fetch markdown content');
        }
        const markdown = await response.text();
        return processMarkdownImages(markdown, topicFolder);
    } catch (error) {
        console.error('Error fetching markdown:', error);
        return '**Error loading content**';
    }
}