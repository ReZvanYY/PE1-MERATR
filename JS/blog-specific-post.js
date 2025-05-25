const blogSpecificPostContainer = document.querySelector('.post-article-container');
const postId = new URLSearchParams(window.location.search).get('id');
const authKey = localStorage.getItem('authKey');


const blogEndPoint = "https://v2.api.noroff.dev/blog/posts/foodie";


const privateUserOption = () => ({
    headers: { 
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${authKey}`,
      'X-Noroff-API-Key': 'd21dfd62-d3dc-4e07-9987-cde61168ffb6',
    }
});

async function loadSingleBlogPost() {
  if (!postId) {
    blogSpecificPostContainer.innerHTML = `<p>No blog post ID provided in URL.</p>`;
    return;
  }

  try {
    const response = await fetch(blogEndPoint, privateUserOption());
    const { data } = await response.json();

    const matchedPost = data.find(post => post.id === postId);

    if (!matchedPost) {
      blogSpecificPostContainer.innerHTML = `<p>Post not found.</p>`;
      return;
    }

    renderBlogPost(matchedPost);
  } catch (err) {
    console.error("Failed to fetch blog post:", err);
    blogSpecificPostContainer.innerHTML = `<p>Failed to fetch the blog post. Please try again later.</p>`;
  }
}

function renderBlogPost(post) {
  blogSpecificPostContainer.innerHTML = '';

  const article = document.createElement('article');
  article.classList.add('post-article');
  article.innerHTML = post.body;

  blogSpecificPostContainer.appendChild(article);
}
loadSingleBlogPost();
