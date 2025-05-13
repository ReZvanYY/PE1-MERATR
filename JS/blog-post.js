const getCurrentDate = () =>{
    const date = new Date();
    return date.toLocaleDateString();
}

const postToBlog = async (blogData) => {
  try {
    const response = await fetch("https://v2.api.noroff.dev/blogs",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "",
      },
      body: JSON.stringify(blogData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error ${response.status}: ${
          errorData.message || "Failed to create the blog post!"
        }`
      );
    }
    const data = await response.json();
    console.log("Blog post has been successfuly created:", data);
    displayBlogPost(data);
  } catch (error) {
    console.error("Error creating the blog post", error.message);
  }
};
const displayBlogPost = (blog) => {
  const blogContainer = document.getElementById("latest-post-grid-layout");
  const blogPostElement = document.createElement("article");
  blogPostElement.className = "blog-post";
  blogPostElement.innerHTML = `
    <div class="blog-post-container">
    <h2 class="blog-post-title">${blog.title}</h2>
    <img src="#" alt="Blog post image of ....." class="blog-post-image">
    <div class="blog-body-content>${blog.content}</div>
    <p class="blog-post-created-date"><strong>Created</strong> ${blog.createdDate}</p>
    <p class="blog-post-edited-date"><strong>Edited</strong>${blog.editedDate}</p>
    </div>
    `;
  blogContainer.appendChild(blogPostElement);
};

const displayMultipleBlogPost = async (blogPosts) => {
  for (const blog of blogPosts) {
    try {
      await postToBlog(blog);
    } catch (error) {
      console.error(
        `Error creating the blog post: "${blog.title}";`,
        error.message);
    }
  }
};

const blogPosts = [
    {
        "title": "Ash E Reshteh",
        "content": `
            <div class="title-container-box">
            <h1 class="blog-post-thumbnail-title">${blog.title}<h1>
            </div>
            <img src="https://i.imgur.com/r2fUjnt.png" alt="a photo of the iranian herb nuddle soup called Ash E Reshteh" class="blog-post-thumbnail-image">
        `,
        "image": "https://i.imgur.com/r2fUjnt.png",
        "createdDate": getCurrentDate(),
        "editedDate": getCurrentDate(),

    }
];

displayMultipleBlogPost(blogPosts);