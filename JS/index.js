const blogEndPoint = "https://v2.api.noroff.dev/blog/posts/foodie";
const authKey = localStorage.getItem("authKey");

const userOptions = () => {
  return {
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${authKey}`,
      "X-Noroff-API-Key": "d21dfd62-d3dc-4e07-9987-cde61168ffb6",
    },
  };
};
async function getRecentPosts() {
  try {
    const res = await fetch(blogEndPoint);
    const data = await res.json();
    const posts = data.data;

    const sorted = posts.sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );
    return sorted.slice(0, 12);
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    return [];
  }
}

function renderCarousel(posts) {
  const track = document.getElementById("carousel-track");
  if (!track) return;

  track.innerHTML = "";

  posts.forEach((post) => {
    const carouselSlide = document.createElement("div");
    carouselSlide.classList.add("carousel-slide");
    carouselSlide.innerHTML = `<a href="../HTML/blog-post-specific.html?id=${
      post.id
    }" class="carousel-link">
            </div>
    <img src="${post.media?.url}" alt="${
      post.media?.alt || post.title
    }" class="carousel-img">
        </a>`;
    track.appendChild(carouselSlide);
  });
  let index = 0;
  const slideCount = posts.length;

  const updateSlide = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
  };

  document.querySelector(".carousel-btn-prev").onclick = () => {
    if (index > 0) index--;
    updateSlide();
  };
  document.querySelector(".carousel-btn-next").onclick = () => {
    if (index > posts.length - 1) index++;
    updateSlide();
  };
  setInterval(() => {
    index = (index + 1) % slideCount;
    updateSlide();
  }, 2000);
}
function renderLatestPostGrid(posts) {
  const grid = document.getElementById("latest-post-grid-layout");
  if (!grid) return;
  grid.innerHTML = "";
  const latestpost = posts.slice(0,4 );

  latestpost.forEach(post =>{
   const postCard = document.createElement('a');
   postCard.href = `../HTML/blog-post-specific.html?id=${post.id}`;
   postCard.classList.add('latest-post-card')
   
   postCard.innerHTML = `
   <section class="postcard-overall-container">
   <div class="postcard-title-background">
    <h4 class="postcard-title">${post.title}</h4>
  </div>
    <div class="postcard-img-container">
     <img src="${post.media?.url || ''}" alt="${post.media?.alt || post.title}" class="postcard-img">
     </div
     </section>
   `;
   grid.appendChild(postCard);
  });
}
getRecentPosts().then(posts => {
    renderCarousel(posts);
    renderLatestPostGrid(posts);
});
