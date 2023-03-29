"use strict";

const APIURL = 'https://api.github.com/users/';

const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');

// ---------------AXIOS DATA GET-----------------

async function getUser (username) {
    try {
        // instead of taking full object, we can destructure res through "{ data }"
        const { data } = await axios(APIURL + username);
        // ! we use async await instead
        // .then(res => console.log(res.data))
        // .catch(err => console.log(err));

        createUserCard(data);
        getRepos(username);

    } catch(err) {
        if(err.response.status == 404) {
            createErrorCard('No profile with this username');
        }
    }   
}

// ---------------END OF AXIOS-----------------

// ---------------CREATING REPOS-----------------

async function getRepos(username) {
    try {
        // instead of taking full object, we can destructure res through "{ data }"
        const { data } = await axios(APIURL + username + '/repos?sort=created');
        // ! we use async await instead
        // .then(res => console.log(res.data))
        // .catch(err => console.log(err));

        addReposToCard(data);

    } catch(err) {
        createErrorCard('Problem fetching repos');
    } 
}

// ---------------END OF CREATING REPOS-----------------

// ---------------CREATING CARDS-----------------

function createUserCard(user) {
    const cardHTML = `
    <article class="card">
    <div><img class="avatar" src="${user.avatar_url}" alt="${user.name}"></div>
    <div class="user-info">
      <h2>${user.name}</h2>
      <p>${user.bio}</p>
      <ul> 
        <li>${user.followers}<strong>Followers</strong></li>
        <li>${user.following}<strong>Following</strong></li>
        <li>${user.public_repos}<strong>Repos</strong></li>
      </ul>
      <div id="repos"></div>
    </div>
  </article>
    `;

    main.innerHTML = cardHTML;
}

function createErrorCard(message) {

    const cardHTML = `
        <div class="card">
            <h1>${message}</h1>
        </div>
    `;

    main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
    const reposEl = document.getElementById('repos');

    repos
        .slice(0, 5) // array method to show only from n to n elemnts
        .forEach(repo => {
            const repoLink = document.createElement('a');
            repoLink.classList.add('repo');
            repoLink.href = repo.html_url;
            repoLink.target = '_blank';
            repoLink.innerText = repo.name;

            reposEl.appendChild(repoLink);
        })
}

// ---------------END OF CREATING CARDS-----------------

// ---------------FORM SUBMIT-----------------

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = search.value;

    if(user) {
        getUser(user);

        search.value = '';
    }
})

// ---------------END FORM SUBMIT-----------------