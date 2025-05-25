const postId = new URLSearchParams(window.location.search).get("id");
const authKey = localStorage.getItem("authKey");
const userName = localStorage.getItem("userName");


if (!postId) {
  console.error("Missing post ID in URL parameters.");
  throw new Error("Missing post ID.");
}

if (!authKey || !userName) {
  alert("You must be signed in to edit a post.");
  throw new Error("Missing authKey or userName.");
}

const userEndPoint = `https://v2.api.noroff.dev/blog/posts/${userName}/${postId}`;

const requestOptions = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authKey}`,
    'X-Noroff-API-Key': '339be548-4eae-4260-bcd5-597493568802'
  }
};


const form = document.querySelector("form");
const titleInput = document.getElementById("title");
const bodyInput = document.getElementById("bodyText");
const imageInput = document.getElementById("blogPostImage");


async function loadPostForEditing() {
  try {
    const res = await fetch(userEndPoint, requestOptions);
    const { data, errors } = await res.json();

    if (!res.ok) {
      throw new Error(errors?.[0]?.message || "Failed to load the post.");
    }


    if (data.author?.name !== userName) {
      form.style.display = "none";

      const message = document.createElement("h1");
      message.textContent = "Unauthorized: You do not own this blog post.";
      message.classList.add("warning-title");
      message.style.color = "red";

      const homeBtn = document.createElement("button");
      homeBtn.textContent = "Home";
      homeBtn.classList.add("return-button");
      homeBtn.onclick = () => window.location.href = "../index.html";

      form.parentElement.append(message, homeBtn);
      return;
    }


    titleInput.value = data.title;
    bodyInput.value = data.body;
    imageInput.value = data.media?.url || "";

  } catch (err) {
    console.error("Failed to load post:", err);
    alert("Unable to load the post. Please try again later.");
  }
}


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  const mediaUrl = imageInput.value.trim();

  if (!title || !body) {
    alert("Please fill out all fields.");
    return;
  }

  const updatedPost = {
    title,
    body,
    media: mediaUrl ? { url: mediaUrl } : null,
  };

  try {
    const res = await fetch(userEndPoint, {
      method: "PUT",
      headers: requestOptions.headers,
      body: JSON.stringify(updatedPost),
    });

    const result = await res.json();

    if (!res.ok) {
      const errorMsg = result.errors?.[0]?.message || "Unknown error";
      throw new Error(errorMsg);
    }

    alert("Post updated successfully!");
    window.location.href = "blog-list.html";
  } catch (err) {
    console.error("Update error:", err);
    alert("Failed to update the post. Please try again.");
  }
});

loadPostForEditing();
