const templateCard = document.querySelector('.templateCard').content;
const containerCard = document.querySelector('.containerCard-grid');
const fragment = new DocumentFragment();

addEventListener('DOMContentLoaded', () => {
    getData();
});

let globalCount = 0;
let petitionCount = 0;
const loadPublic = (entries) => {
    if (entries[0].isIntersecting) {
        getData();
    }
}

const observer = new IntersectionObserver(loadPublic, { rootMargin: "-10%" });

const getData = async () => {
    const urls = ['https://rickandmortyapi.com/api/character', 'https://rickandmortyapi.com/api/character?page=2', 'https://rickandmortyapi.com/api/character?page=3']
    try {
        const req = await Promise.all(urls.map((url) => fetch(url)));
        let fullResult = [];

        for (let indexReq of req) {
            const response = await indexReq.json();
            fullResult.push(response.results);
        }

        let dataObservable = fullResult[petitionCount].slice(globalCount, globalCount + 4);

        if (dataObservable.length === 4) {
            globalCount += dataObservable.length;
            createCard(dataObservable);
            if (globalCount === fullResult[petitionCount].length) {
                petitionCount++;
                globalCount = 0;
            }
        }
    } catch (e) {
        console.log(e.message);
    }
}

const createCard = (data) => {
    data.forEach(info => {
        templateCard.querySelector('.card-img-top').setAttribute('src', info.image);
        templateCard.querySelector('.card-header').textContent = info.name;
        templateCard.querySelector('.status').textContent = info.status;
        templateCard.querySelector('.species').textContent = info.species;
        templateCard.querySelector('.location').textContent = `Location: ${info.location.name}`;
        templateCard.querySelector('.origin').textContent = `Origin: ${info.origin.name}`;
        templateCard.querySelector('.card-link').setAttribute('href', 'https://rickandmortyapi.com/api/episode/');

        const card = templateCard.cloneNode(true);
        fragment.appendChild(card);
    });

    containerCard.appendChild(fragment);

    const observe = containerCard.querySelectorAll('.card');
    observer.observe(observe[observe.length - 1]);
}