document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonNumber = urlParams.get('number');

    if (pokemonNumber) {
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`;

        async function getPokemonDetail() {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Erro ao carregar os detalhes do Pokémon');
                }
                const pokeDetail = await response.json();
                return convertPokeApiDetailToPokemon(pokeDetail);
            } catch (error) {
                console.error('Erro ao buscar os detalhes do Pokémon:', error);
                throw error; // Propaga o erro para ser tratado externamente, se necessário
            }
        }

        function convertPokeApiDetailToPokemon(pokeDetail) {
            const pokemon = new Pokemon();
            pokemon.number = pokeDetail.id;
            pokemon.name = pokeDetail.name;

            const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
            const [type] = types;

            pokemon.types = types;
            pokemon.type = type;

            pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

            return pokemon;
        }

        getPokemonDetail().then((pokemon) => {
            const pokemonDetailHtml = `
                <h1>${pokemon.name}</h1>
                <span class="number">#${pokemon.number}</span>
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            `;
            const pokemonDetailElement = document.getElementById('pokemonDetail');
            if (pokemonDetailElement) {
                pokemonDetailElement.innerHTML = pokemonDetailHtml;
            } else {
                console.error('Elemento com id "pokemonDetail" não encontrado.');
            }
        }).catch((error) => {
            console.error('Erro ao renderizar os detalhes do Pokémon:', error);
        });
    }
});
