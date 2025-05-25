import { startingPosts } from "./blogStorage.js";
const blogEndPoint = "https://v2.api.noroff.dev/blog/posts/foodie"
const authKey = localStorage.getItem('authKey');

if(!authKey){
    console.error('Missing authKey');
}
const userOptions = () => {
    return{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authKey}`,
            'X-Noroff-API-Key': 'd21dfd62-d3dc-4e07-9987-cde61168ffb6',
        }
    };
};

const createPost = async (post) => {
    try{
        const res = await fetch(blogEndPoint, {
            method: 'POST',
            headers: userOptions().headers,
            body: JSON.stringify(post),
        });
        const data = await res.json();

        if(!res.ok){
            console.error('Error creating post:', data);
            throw new Error(data.message || 'Error creating post failed');
        }
        console.log('post created', data);
    } catch(error){
        console.error('Create post error', error.message);
    }
};

const fetchAllPosts = async () => {
    try{
        const res = await fetch(blogEndPoint, userOptions());
        const result = await res.json();

        if(!res.ok){
            throw new Error(result.message || `Failed to fetch posts: ${res.status}`);
        }
        return result.data || [];
    }catch(err){
        console.error('Fetch error:', err.meessage);
        return [];
    }
}

const removeDuplicates = async () => {
    const posts = await fetchAllPosts();
    const discovered = new Map();
    const duplicates = [];

    for(const post of posts){
        const key = `${post.title?.trim().toLowerCase()}|${post.media?.url || ''}`;
        if(discovered.has(key)){
            duplicates.push(post.id);
        } else {
            discovered.set(key, post.id);
        }
    }
    for (const id of duplicates){
        try{
            const deleteRes = await fetch(`${blogEndPoint}/${id}`, {
                method: 'DELETE',
                headers: userOptions().headers,
            });
            if(!deleteRes.ok){
                const erData = await deleteRes.json();
                console.error(`Failed to delete ${id}`, erData.message);
            } else {
                console.log(`Deleted dup: ${id}`);
            }
        } catch(error){
            console.error(`Error deleting ${id}:`, error.message);
        }
    }
};

const uploadNewPosts = async () => {
    const existing = await fetchAllPosts();
    const existingKeys = existing.map(
        post => `${post.title?.trim().toLowerCase()}|${post.media?.url || ''}`
    );
    for (const post of startingPosts){
        const key = `${post.title?.trim().toLowerCase()}|${post.media?.url || ''}`;

        if(!existingKeys.includes(key)){
            await createPost(post);
        } else {
            console.log(`post already exists: ${post.title}`);
        }
    }
};

(async () => {
    await removeDuplicates();
    await uploadNewPosts();
})();