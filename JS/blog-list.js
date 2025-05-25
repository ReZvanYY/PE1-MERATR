const authKey = localStorage.getItem("authKey");
const thisUser = localStorage.getItem('userName');
const admin = thisUser === "foodie";

const blogEndPoint = "https://v2.api.noroff.dev/blog/posts/foodie";
const userEndPoint = `https://v2.api.noroff.dev/blog/posts/${thisUser}`;

const blogFeedContainer = document.querySelector('.post-feed-container');
const newPostBtn = document.querySelector('.create-new-post-btn')

const privateUserOption = () => ({
    headers: { 
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${authKey}`,
      'X-Noroff-API-Key': 'd21dfd62-d3dc-4e07-9987-cde61168ffb6',
    }
});

const thisUserOptions = {
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": "d21dfd62-d3dc-4e07-9987-cde61168ffb6",
    }
};

const isLoggedIn = () => !!authKey;

async function ReceiveAllPosts() {
    try{
        const request = [
            fetch (blogEndPoint, thisUserOptions),
            isLoggedIn()
            ? fetch(userEndPoint, privateUserOption())
            : Promise.resolve({ json: () => ({ data: [] }) })
        ];

        const [blogResponse, userResponse] = await Promise.all(request);
        const blogData = await blogResponse.json();
        const userData = await userResponse.json();

        const allResponse = [...blogData.data, ...userData.data];
        const removeDuplicates = Array.from(new Map(allResponse.map(post => [post.id, post])).values());

        const blogPostSorted = removeDuplicates
        .filter(post => post && post.created)
        .sort((a, b) => new Date(b.created) - new Date(a.created));
        
        renderPosts(blogPostSorted);
    } catch (error){
        console.error("Error fetching blog posts", error);
        blogFeedContainer.innerHTML = `<p> FAILED TO FETCH POST`;
    }
}

function renderPosts(posts) {
    blogFeedContainer.innerHTML ='';

    posts.forEach(post => {
        const postWrapperElement = document.createElement('div');
        postWrapperElement.classList.add('post-wrapper')
        
        const postArticleElement = document.createElement('article');
        postArticleElement.classList.add('post-article-container');

        postArticleElement.innerHTML = `
          <a href="../HTML/blog-post-specific.html?id=${post.id}">
    <h5 class="post-title">${post.title}</h5>
    <img src="${post.media?.url}" alt="${post.media?.alt || post.title}" class="post-img">
    </a>
        `;

        if(isLoggedIn() && (admin || post.author?.name === thisUser)){
            const buttonWrapper = document.createElement('div');
            buttonWrapper.classList.add('button-wrapper');

            const editbtn = document.createElement('button');
            editbtn.classList.add('edit-btn');
            editbtn.textContent = 'EDIT';
            editbtn.onclick = () => {
                window.location.href = `../HTML/blog-post-specific.html?id=${post.id}`
            };
            
            const deletebtn = document.createElement('button');
            deletebtn.classList.add('delete-btn');
            deletebtn.textContent = 'DELETE';
            deletebtn.onclick = () => deletePost(post.id, post.title);

            buttonWrapper.append(editbtn, deletebtn);
            postArticleElement.appendChild(buttonWrapper);    
        }
        postWrapperElement.appendChild(postArticleElement);
        blogFeedContainer.appendChild(postWrapperElement);
    });
}

async function deletePost(postId, postTitle){
    try{
        const response = await fetch(userEndPoint, {
            method: 'GET',
            headers: privateUserOption().headers,
        });

        if(!response.ok){
            const errData = await response.json();
            throw new Error(errData.message || "Authorization failed");
        }
        const userPosts = await response.json();
        const post = userPosts.data.find(p => p.id === postId);

        if(!post || post.author?.name !== thisUser){
            alert("Unauthorized: YOU SHALL NOT PASS!")
            return;
        }
        const deleteResponse = await fetch(`${userEndPoint}/${postId}`,{
            method: 'DELETE',
            headers: privateUserOption().headers,
        });
        if(!deleteResponse.ok){
            const erData = await deletePost.json();
            throw new Error(erData.message || "Delete failed, try again later");
        }
        ReceiveAllPosts();
    } catch(error){
        console.error("Delete error", error.message);
        alert(`FAILED TO DELETE THE POST: ${postTitle}`)
    }
    if(newPostBtn){
        newPostBtn.style.display = isLoggedIn() ? 'block' : 'none';
        newPostBtn.addEventListener('click', () =>{
            window.location.href = '../HTML/create-new-post.html';
        });
    }
}
ReceiveAllPosts();