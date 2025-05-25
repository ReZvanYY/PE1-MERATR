
const authKey = localStorage.getItem('authKey');
const userName = localStorage.getItem('userName');


if (!authKey || !userName) {
  alert('You must be signed in to create a post.');
  throw new Error('Missing authKey or userName.');
}

const createPostUrl = `https://v2.api.noroff.dev/blog/posts/${userName}`;

const getAuthHeaders = () => ({
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authKey}`,
    'X-Noroff-API-Key': '339be548-4eae-4260-bcd5-597493568802'
  }
});


const form = document.querySelector('form');
const titleInput = document.getElementById('postTitle');
const bodyInput = document.getElementById('bodyText');
const imageUrlInput = document.getElementById('thumbnailImage');


form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  const mediaUrl = imageUrlInput.value.trim();


  if (!title || !body) {
    alert('Please fill out all required fields.');
    return;
  }

  const newPost = {
    title,
    body,
    media: mediaUrl ? { url: mediaUrl } : null
  };

  try {
    const response = await fetch(createPostUrl, {
      method: 'POST',
      headers: getAuthHeaders().headers,
      body: JSON.stringify(newPost)
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result.errors?.[0]?.message || 'Unknown error';
      console.error('API Error:', result);
      alert(`Failed to create post: ${errorMsg}`);
      return;
    }

    alert('Post created successfully!');
    form.reset();
    window.location.href = '../HTML/blog-feed-post.html';
  } catch (err) {
    console.error('Unexpected error:', err);
    alert('An unexpected error occurred. Please try again.');
  }
});
