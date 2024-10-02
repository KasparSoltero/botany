document.addEventListener('DOMContentLoaded', () => {
    const topicTitles = document.querySelectorAll('.topic-title');

    topicTitles.forEach(title => {
        title.addEventListener('click', () => {
            const content = title.nextElementSibling;
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });
});