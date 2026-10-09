const BASE_URL = 'https://jsonplaceholder.typicode.com';

const postsContainer = document.getElementById('posts-container');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const userIdInput = document.getElementById('user-id-input');
const searchBtn = document.getElementById('search-btn');
const loadParallelBtn = document.getElementById('load-parallel-btn');
const parallelResult = document.getElementById('parallel-result');
const modal = document.getElementById('details-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.getElementById('close-modal');

// Функция универсального запроса с try/catch и проверкой response.ok
async function fetchData(url) {
  loadingDiv.classList.remove('hidden');
  errorDiv.classList.add('hidden');
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    errorDiv.textContent = `Не удалось загрузить данные: ${error.message}`;
    errorDiv.classList.remove('hidden');
    return null;
  } finally {
    loadingDiv.classList.add('hidden');
  }
}

// Рендер списка постов
function renderPosts(posts) {
  postsContainer.innerHTML = '';
  if (!posts || posts.length === 0) {
    postsContainer.innerHTML = '<p>Посты не найдены</p>';
    return;
  }

  posts.forEach(post => {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.innerHTML = `
      <h4>${post.title}</h4>
      <p>${post.body.substring(0, 80)}...</p>
    `;
    // Клик для детального просмотра (второй запрос по ID)
    card.addEventListener('click', () => loadPostDetails(post.id));
    postsContainer.appendChild(card);
  });
}

// Загрузка деталей одного поста (второй запрос по id)
async function loadPostDetails(id) {
  const post = await fetchData(`${BASE_URL}/posts/${id}`);
  if (post) {
    modalBody.innerHTML = `
      <h2>${post.title}</h2>
      <p>${post.body}</p>
      <p><small>ID пользователя: ${post.userId}</small></p>
    `;
    modal.classList.remove('hidden');
  }
}

// Поиск с query-параметром (?userId=...)
searchBtn.addEventListener('click', async () => {
  const userId = userIdInput.value.trim();
  const url = userId ? `${BASE_URL}/posts?userId=${userId}` : `${BASE_URL}/posts`;
  const posts = await fetchData(url);
  renderPosts(posts);
});

// Два запроса параллельно через Promise.all
loadParallelBtn.addEventListener('click', async () => {
  loadingDiv.classList.remove('hidden');
  errorDiv.classList.add('hidden');
  try {
    const [postsRes, usersRes] = await Promise.all([
      fetch(`${BASE_URL}/posts?_limit=3`),
      fetch(`${BASE_URL}/users?_limit=3`)
    ]);

    if (!postsRes.ok || !usersRes.ok) throw new Error('Ошибка параллельной загрузки');

    const posts = await postsRes.json();
    const users = await usersRes.json();

    parallelResult.innerHTML = `Успешно загружено постов: ${posts.length}, пользователей: ${users.length}`;
  } catch (error) {
    errorDiv.textContent = error.message;
    errorDiv.classList.remove('hidden');
  } finally {
    loadingDiv.classList.add('hidden');
  }
});

closeModal.addEventListener('click', () => modal.classList.add('hidden'));

// Первоначальная загрузка всех постов
async function init() {
  const posts = await fetchData(`${BASE_URL}/posts?_limit=10`);
  renderPosts(posts);
}

init();