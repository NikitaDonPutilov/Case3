function registerUser(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(user => user.username === username)) {
        alert('Username already exists');
        return;
    }

    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful');
    window.location.href = 'login.html';
}

function loginUser(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        alert('Invalid username or password');
        return;
    }

    localStorage.setItem('currentUser', username);
    alert('Login successful');
    window.location.href = 'index.html';
}

function createPost(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
        alert('You must be logged in to create a post');
        return;
    }

    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push({ id: Date.now(), title, content, author: currentUser });
    localStorage.setItem('posts', JSON.stringify(posts));
    alert('Post created');
    window.location.href = 'index.html';
}

function displayPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postsDiv = document.getElementById('posts');
    postsDiv.innerHTML = '';

    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <p><strong>Author:</strong> ${post.author}</p>
            <a href="view_post.html?id=${post.id}">View</a>
        `;
        postsDiv.appendChild(postDiv);
    });
}

function displayPost() {
    const postId = new URLSearchParams(window.location.search).get('id');
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts.find(post => post.id == postId);

    if (!post) {
        alert('Post not found');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('postTitle').innerText = post.title;
    document.getElementById('postContent').innerText = post.content;
}

function loadPostForEdit() {
    const postId = new URLSearchParams(window.location.search).get('id');
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts.find(post => post.id == postId);

    if (!post) {
        alert('Post not found');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('editTitle').value = post.title;
    document.getElementById('editContent').value = post.content;
}

function savePost(event) {
    event.preventDefault();
    const postId = new URLSearchParams(window.location.search).get('id');
    const title = document.getElementById('editTitle').value;
    const content = document.getElementById('editContent').value;

    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postIndex = posts.findIndex(post => post.id == postId);

    if (postIndex === -1) {
        alert('Post not found');
        return;
    }

    posts[postIndex].title = title;
    posts[postIndex].content = content;
    localStorage.setItem('posts', JSON.stringify(posts));
    alert('Post saved');
    window.location.href = `view_post.html?id=${postId}`;
}

function deletePost() {
    const postId = new URLSearchParams(window.location.search).get('id');
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts = posts.filter(post => post.id != postId);
    localStorage.setItem('posts', JSON.stringify(posts));
    alert('Post deleted');
    window.location.href = 'index.html';
}
