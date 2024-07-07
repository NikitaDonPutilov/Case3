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

    users.push({ username, email, password, subscriptions: [] });
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
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());
    const isPrivate = document.getElementById('private').checked;
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
        alert('You must be logged in to create a post');
        return;
    }

    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const newPost = { id: Date.now(), title, content, tags, isPrivate, author: currentUser, comments: [] };
    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    alert('Post created');
    window.location.href = 'index.html';
}

function displayPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postsDiv = document.getElementById('posts');
    postsDiv.innerHTML = '';

    posts.forEach(post => {
        if (!post.isPrivate) {
            const postDiv = document.createElement('div');
            postDiv.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <p><strong>Author:</strong> ${post.author}</p>
                <p><strong>Tags:</strong> ${post.tags.join(', ')}</p>
                <a href="view_post.html?id=${post.id}">View</a>
            `;
            postsDiv.appendChild(postDiv);
        }
    });
}

function displayUsersForSubscription() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = localStorage.getItem('currentUser');
    const userDiv = document.getElementById('users');
    userDiv.innerHTML = '';

    users.forEach(user => {
        if (user.username !== currentUser) {
            const userElement = document.createElement('div');
            userElement.innerHTML = `
                <p>${user.username}</p>
                <button onclick="subscribeUser('${user.username}')">Subscribe</button>
            `;
            userDiv.appendChild(userElement);
        }
    });
}

function subscribeUser(username) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = localStorage.getItem('currentUser');
    const user = users.find(user => user.username === currentUser);

    if (user.subscriptions.includes(username)) {
        alert('Already subscribed');
        return;
    }

    user.subscriptions.push(username);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Subscribed');
}

function displaySubscribedPosts() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = localStorage.getItem('currentUser');
    const user = users.find(user => user.username === currentUser);
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postsDiv = document.getElementById('subscribedPosts');
    postsDiv.innerHTML = '';

    posts.forEach(post => {
        if (user.subscriptions.includes(post.author)) {
            const postDiv = document.createElement('div');
            postDiv.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <p><strong>Author:</strong> ${post.author}</p>
                <p><strong>Tags:</strong> ${post.tags.join(', ')}</p>
                <a href="view_post.html?id=${post.id}">View</a>
            `;
            postsDiv.appendChild(postDiv);
        }
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
    document.getElementById('postTags').innerText = `Tags: ${post.tags.join(', ')}`;

    if (post.comments.length > 0) {
        const commentsDiv = document.getElementById('comments');
        post.comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.innerHTML = `
                <p>${comment.content}</p>
                <p><strong>Author:</strong> ${comment.author}</p>
            `;
            commentsDiv.appendChild(commentDiv);
        });
    }
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
    document.getElementById('editTags').value = post.tags.join(', ');
    document.getElementById('editPrivate').checked = post.isPrivate;
}

function savePost(event) {
    event.preventDefault();
    const postId = new URLSearchParams(window.location.search).get('id');
    const title = document.getElementById('editTitle').value;
    const content = document.getElementById('editContent').value;
    const tags = document.getElementById('editTags').value.split(',').map(tag => tag.trim());
    const isPrivate = document.getElementById('editPrivate').checked;

    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postIndex = posts.findIndex(post => post.id == postId);

    if (postIndex === -1) {
        alert('Post not found');
        return;
    }

    posts[postIndex].title = title;
    posts[postIndex].content = content;
    posts[postIndex].tags = tags;
    posts[postIndex].isPrivate = isPrivate;
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

function addComment(event) {
    event.preventDefault();
    const postId = new URLSearchParams(window.location.search).get('id');
    const content = document.getElementById('commentContent').value;
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
        alert('You must be logged in to comment');
        return;
    }

    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts.find(post => post.id == postId);

    if (!post) {
        alert('Post not found');
        return;
    }

    post.comments.push({ content, author: currentUser });
    localStorage.setItem('posts', JSON.stringify(posts));
    alert('Comment added');
    displayPost();
}
