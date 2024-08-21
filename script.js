const API_KEY = "17ada45b33d9439388519686fb217ebb";
const url = "https://newsapi.org/v2/everything?q=";
let currentLanguage = 'en'; // Default language is English
let currentArticles = []; // Store articles globally
let visibleCount = 6; // Number of visible cards initially
const cardsPerPage = 6; // Number of cards to show on each click

window.addEventListener('load', () => fetchNews("World"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&language=${currentLanguage}&apiKey=${API_KEY}`);
    const data = await res.json();
    currentArticles = data.articles; // Store fetched articles
    bindData(); // Bind data initially
}

function bindData() {
    const cardsContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.getElementById('template-news-card');
    
    cardsContainer.innerHTML = '';

    // Slice the articles array to show only the visible ones
    const visibleArticles = currentArticles.slice(0, visibleCount);
    visibleArticles.forEach(article => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });

    // Hide "Show More" button if all articles are shown
    const showMoreBtn = document.getElementById('show-more-btn');
    if (visibleCount >= currentArticles.length) {
        showMoreBtn.style.display = 'none';
    } else {
        showMoreBtn.style.display = 'block';
    }
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"
    });

    newsSource.innerHTML = `${article.source.name} - ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

function showMore() {
    visibleCount += cardsPerPage; // Increase the count of visible cards
    bindData(); // Re-bind the data to show more cards
}

let curSelectedNav = null;

function onNavItemClick(id) {
    fetchNews(id);
    const navItems = document.getElementById(id);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = navItems;
    curSelectedNav.classList.add('active');
}

// Language selection handling
function changeLanguage(language) {
    currentLanguage = language;
    fetchNews(curSelectedNav ? curSelectedNav.id : "World");
}

// Event listener for the search button
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
