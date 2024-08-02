document.addEventListener("DOMContentLoaded", () => {
    loadPokemon();

    document.getElementById('load-more').addEventListener('click', loadPokemon);

    document.getElementById('pokemon-gallery').addEventListener('click', event => {
        if (event.target.tagName === 'IMG') {
            const pokemonUrl = event.target.dataset.url;
            showPokemonDetails(pokemonUrl);
        }
    });
  
   
});

let offset = 0;

async function loadPokemon() {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=12`);
    const data = await response.json();

    const gallery = document.getElementById('pokemon-gallery');

    data.results.forEach(pokemon => {
        const { name, url } = pokemon;
        const id = parseUrl(url);
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

        const pokemonElement = document.createElement('div');
        pokemonElement.classList.add('pokemon');
        pokemonElement.innerHTML = `
            <img src="${imageUrl}" alt="${name}" data-url="${url}">
            <p>${name}</p>
            <button class="catch-btn">Catch</button>
        `;
        gallery.appendChild(pokemonElement);

        const catchButton = pokemonElement.querySelector('.catch-btn');
        catchButton.addEventListener('click', () => {
            savePokemon(name, imageUrl);
        });
    });

    offset += 20;
}

async function showPokemonDetails(url) {
    const response = await fetch(url);
    const pokemon = await response.json();
    console.log(pokemon);
    const modal = document.getElementById('pokemon-details-modal');
    modal.innerHTML = `
        <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
        <h2>${pokemon.name}</h2>
        <p>Abilities: ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
        <p>Types: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
        <button id="close-modal">Close</button>
    `;
    modal.style.display = 'flex';
    document.getElementById('close-modal').addEventListener('click', hidePokemonDetails);

    function hidePokemonDetails() {
        document.getElementById('pokemon-details-modal').style.display = 'none';
    }
}


function parseUrl(url) {
    return url.substring(url.substring(0, url.length - 2).lastIndexOf('/') + 1, url.length - 1);
}

function savePokemon(pokemonName, pokemonUrl) {
    let savedPokemon = localStorage.getItem('savedPokemon-s');
    savedPokemon = savedPokemon ? JSON.parse(savedPokemon) : [];

    savedPokemon.push({ name: pokemonName, url: pokemonUrl });

    localStorage.setItem('savedPokemon-s', JSON.stringify(savedPokemon));

    window.location.href = 'saved.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const savedPokemon = localStorage.getItem('savedPokemon-s');
    const pokemonGallery = document.getElementById('pokemon-gallery-save');

    if (savedPokemon) {
        const savedPokemonData = JSON.parse(savedPokemon);

        savedPokemonData.forEach(pokemon => {
            const { name, url } = pokemon;

            const pokemonElement = document.createElement('div');
            pokemonElement.classList.add('pokemon');
            pokemonElement.innerHTML = `
                <div href="#" class="pokemon">
                    <img src="${url}" alt="${name}">
                    <p>${name}</p>
                </div>
            `;
            pokemonGallery.appendChild(pokemonElement);
        });
    } else {
        pokemonGallery.innerHTML = '<p>No saved Pokemon</p>';
    }
});
document.addEventListener("DOMContentLoaded", function() {
    var storedData = JSON.parse(localStorage.getItem("savedPokemon-s"));

    if (storedData && storedData.length > 0) {
        var pokemonListContainer = document.getElementById("pokemonList");

        storedData.forEach(function(item, index) {
            var listItem = document.createElement("div");

            listItem.innerHTML = `
            <div class="pokemon">
                <img src="${item.url}" alt="${item.name}" style="width: 100px; height: 100px;">
                <p>${item.name}</p>
                <button onclick="deletePokemon(${index})">Release</button></div>
            `;

            pokemonListContainer.appendChild(listItem);
        });
    }
});

function deletePokemon(index) {
    var storedData = JSON.parse(localStorage.getItem("savedPokemon-s"));

    if (storedData && storedData.length > 0) {
        storedData.splice(index, 1);

        localStorage.setItem("savedPokemon-s", JSON.stringify(storedData));

        location.reload();
    }
}