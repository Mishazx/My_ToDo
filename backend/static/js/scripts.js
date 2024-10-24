let token = sessionStorage.getItem('token') || '';

if (token) {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('task-section').style.display = 'block';
    fetchTasks();
}

async function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    alert('User registered');
}

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (response.ok) {
        const data = await response.json();
        token = data.access_token;
        alert('Logged in!');
        sessionStorage.setItem('token', token);
        document.getElementById('auth').style.display = 'none';
        document.getElementById('task-section').style.display = 'block';
        fetchTasks();
    } else {
        alert('Login failed');
    }
}

async function fetchTasks() {
    const response = await fetch('/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const tasks = await response.json();
    const tasksDiv = document.getElementById('tasks');
    tasksDiv.innerHTML = '';
    tasks.forEach((task) => {
        tasksDiv.innerHTML += `
            <div class="task" data-id="${task.id}">
                <strong>${task.title}</strong>
                <p>${task.description || ''}</p>
                <button class="btn btn-warning btn-sm" onclick="editTask(${task.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Delete</button>
            </div>`;
    });
}

async function addTask() {
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    await fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
    });
    fetchTasks();
}

async function editTask(id) {
    const title = prompt("Enter new title:");
    const description = prompt("Enter new description:");
    if (title) {
        await fetch(`/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description })
        });
        fetchTasks();
    }
}

async function deleteTask(id) {
    await fetch(`/tasks/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    fetchTasks();
}

function toggleAuth() {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    if (registerForm.style.display === 'none') {
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
    } else {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    }
}

function logout() {
    sessionStorage.removeItem('token');
    token = '';
    document.getElementById('auth').style.display = 'block';
    document.getElementById('task-section').style.display = 'none';
}
