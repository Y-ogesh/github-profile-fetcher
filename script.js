const fetchBtn = document.getElementById('fetch-btn');
const usernameInput = document.getElementById('username');
const profileDiv = document.getElementById('profile');

fetchBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  
  // Clear previous results and show loading spinner
  profileDiv.innerHTML = '';
  document.getElementById('loading').style.display = 'block';

  // Input validation
  if (!username) {
    profileDiv.innerHTML = '<p class="error">Please enter a username!</p>';
    document.getElementById('loading').style.display = 'none';
    return;
  }

  try {
    // Fetch user profile
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    if (!userResponse.ok) throw new Error('User not found');
    const userData = await userResponse.json();
  
    // Fetch user repos (without sorting initially)
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`); // Get more repos
    const reposData = await reposResponse.json();
  
    // Sort repos by stars (descending) and take top 5
    const topRepos = reposData
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5);
  
    displayProfile(userData, topRepos);
  } catch (error) {
    profileDiv.innerHTML = `<p class="error">${error.message}</p>`;
  } finally {
    document.getElementById('loading').style.display = 'none';
  }
});

function displayProfile(user, repos) {
    // Profile HTML
    const profileHTML = `
      <div class="profile-header">
        <img src="${user.avatar_url}" alt="Avatar" class="avatar">
        <h2>${user.name || user.login}</h2>
        <p>${user.bio || 'No bio available.'}</p>
        <p>Followers: ${user.followers} | Following: ${user.following}</p>
        <p>Public Repos: ${user.public_repos}</p>
        <a href="${user.html_url}" target="_blank">View Profile on GitHub</a>
      </div>
    `;
  
    // Repos HTML
    let reposHTML = '<h3>Top Repositories:</h3>';
    if (repos?.length > 0) {
      reposHTML += `
        <ul>
          ${repos.map(repo => `
            <li>
              <a href="${repo.html_url}" target="_blank">${repo.name}</a>
              (&#9733; ${repo.stargazers_count})
            </li>
          `).join('')}
        </ul>
      `;
    } else {
      reposHTML += '<p>No public repositories found.</p>';
    }
  
    // Combine
    profileDiv.innerHTML = `
      <div class="profile-card">
        ${profileHTML}
        ${reposHTML}
      </div>
    `;
  }