document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
    const baseUrl = 'https://api.github.com';
    let searchType = 'users'; // Default search type

    // Add toggle button for search type
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle to Repo Search';
    toggleButton.style.margin = '10px';
    form.appendChild(toggleButton);

    // Toggle search type
    toggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        searchType = searchType === 'users' ? 'repos' : 'users';
        toggleButton.textContent = `Toggle to ${searchType === 'users' ? 'Repo' : 'User'} Search`;
        clearResults();
    });

    // Form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (!searchTerm) return;

        clearResults();

        if (searchType === 'users') {
            searchUsers(searchTerm);
        } else {
            searchRepos(searchTerm);
        }
    });

    // Search for users
    function searchUsers(query) {
        fetch(`${baseUrl}/search/users?q=${encodeURIComponent(query)}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Rate limit exceeded or invalid response');
            return response.json();
        })
        .then(data => {
            displayUsers(data.items);
        })
        .catch(error => console.error('Error searching users:', error));
    }

    // Search for repositories (bonus)
    function searchRepos(query) {
        fetch(`${baseUrl}/search/repositories?q=${encodeURIComponent(query)}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Rate limit exceeded or invalid response');
            return response.json();
        })
        .then(data => {
            displayRepos(data.items);
        })
        .catch(error => console.error('Error searching repos:', error));
    }

    // Display user search results
    function displayUsers(users) {
        users.forEach(user => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${user.avatar_url}" alt="${user.login}" width="50" height="50">
                <a href="${user.html_url}" target="_blank">${user.login}</a>
            `;
            li.style.cursor = 'pointer';
            li.addEventListener('click', () => fetchUserRepos(user.login));
            userList.appendChild(li);
        });
    }

    // Fetch and display user repositories
    function fetchUserRepos(username) {
        reposList.innerHTML = ''; // Clear previous repos
        fetch(`${baseUrl}/users/${username}/repos`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Rate limit exceeded or invalid response');
            return response.json();
        })
        .then(repos => {
            displayRepos(repos);
        })
        .catch(error => console.error('Error fetching repos:', error));
    }

    // Display repositories
    function displayRepos(repos) {
        repos.forEach(repo => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                <p>${repo.description || 'No description'}</p>
            `;
            reposList.appendChild(li);
        });
    }

    // Clear previous results
    function clearResults() {
        userList.innerHTML = '';
        reposList.innerHTML = '';
    }
});