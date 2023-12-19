let currentPage = 1;
const limit = 8; // Number of items per page
let loading = false;

function showLoadingIndicator() {
	$("#loading-indicator").show();
}

function hideLoadingIndicator() {
	$("#loading-indicator").hide();
}

function loadPokemonDetails(pokemonUrl) {
	return $.ajax({
		url: pokemonUrl,
		type: "GET",
	});
}

function displayPokemon(pokemon) {
	const pokemonDiv = $(
		'<div class="border-solid border-2 p-4 rounded-lg h-min-content"></div>'
	);
	const title = $(`<h2 class="font-bold capitalize text-center" ></h2>`).text(
		pokemon.name
	);
	const image = $(`<img class="item-center m-auto w-[200px] h-[200px]">`).attr(
		"src",
		pokemon.sprites.front_default
	);

	const skills = pokemon.abilities
		.map((ability) => ability.ability.name)
		.join(", ");
	const types = pokemon.types.map((type) => type.type.name).join(", ");

	let statsHtml = "<ul>";
	pokemon.stats.forEach((stat) => {
		statsHtml += `<li class="capitalize">${stat.stat.name}: ${stat.base_stat}</li>`;
	});
	statsHtml += "</ul>";

	pokemonDiv.append(
		title,
		image,
		$("<p></p>").text(`Skills: ${skills}`),
		$("<p></p>").text(`Types: ${types}`),
		$(statsHtml)
	);
	$("#pokemon-list").append(pokemonDiv);
}

function loadPokemons() {
	if (loading) return;
	loading = true;
	showLoadingIndicator();

	const offset = (currentPage - 1) * limit;
	$.ajax({
		url: `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
		type: "GET",
		success: function (response) {
			const pokemonPromises = response.results.map((pokemon) =>
				loadPokemonDetails(pokemon.url)
			);
			$.when(...pokemonPromises).then(function (...pokemons) {
				pokemons.forEach((pokemon) => displayPokemon(pokemon[0]));
				currentPage++;
				loading = false;
				hideLoadingIndicator();
			});
		},
		error: function () {
			$("#pokemon-list").append("<p>Error loading more Pokémon.</p>");
			loading = false;
			hideLoadingIndicator();
		},
	});
}

$(document).ready(function () {
	loadPokemons();

	$(window).scroll(function () {
		if (
			$(window).scrollTop() + $(window).height() >
			$(document).height() - 100
		) {
			loadPokemons();
		}
	});
});
