// DOM OBJECTS
const pokeScreen = document.querySelector(".poke-screen");
const pokeName = document.querySelector(".poke-name");
const pokeId = document.querySelector(".poke-id");
const pokeImage = document.querySelector(".poke-image");
const pokeFirstType = document.querySelector(".poke-first-type");
const pokeSecondType = document.querySelector(".poke-second-type");
const nextPoke = document.querySelector(".poke-btn");

// A list to store all Pokémon names for the autocomplete feature
let pokemonList = [];

// ADDING EVENT LISTENERS
nextPoke.addEventListener("click", getAll);

// Functions
const reset = () => {
	pokeScreen.classList.remove("d-none");
};

// Function to fetch the list of all Pokémon names
async function fetchPokemonList() {
	try {
		const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1200");
		const data = await response.json();
		pokemonList = data.results.map((pokemon) => pokemon.name);
	} catch (error) {
		console.error("Error fetching Pokémon list:", error);
	}
}

// Function to add the search bar dynamically with autocomplete feature
function addSearchBar() {
	const insertionPoint = document.getElementById("insertion-point");

	const searchBar = document.createElement("input");
	searchBar.type = "text";
	searchBar.placeholder = "Search Pokémon...";
	searchBar.style.marginLeft = "20px"; // Adds some space between the search bar and the div
	insertionPoint.insertAdjacentElement("afterend", searchBar);

	// Create a div to hold the autocomplete results
	const autoCompleteDiv = document.createElement("div");
	autoCompleteDiv.style.position = "absolute";
	autoCompleteDiv.style.border = "1px solid #ccc";
	autoCompleteDiv.style.backgroundColor = "#fff";
	autoCompleteDiv.style.maxHeight = "100px";
	autoCompleteDiv.style.overflowY = "auto";
	searchBar.insertAdjacentElement("afterend", autoCompleteDiv);

	// Adding an event listener to implement the autocomplete feature
	searchBar.addEventListener("input", () => {
		let matches = pokemonList.filter((pokemon) =>
			pokemon.startsWith(searchBar.value.toLowerCase())
		);
		showAutocompleteResults(matches, autoCompleteDiv);
	});

	// Adding an event listener to trigger the searchPokemon function on 'change' event
	searchBar.addEventListener("change", () => {
		searchPokemon(searchBar.value);
	});
}

// Function to show autocomplete results
function showAutocompleteResults(matches, autoCompleteDiv) {
	autoCompleteDiv.innerHTML = "";
	matches.forEach((match) => {
		const div = document.createElement("div");
		div.textContent = match;
		div.style.padding = "5px";
		div.addEventListener("click", () => {
			searchPokemon(match);
			autoCompleteDiv.innerHTML = ""; // Clear the autocomplete results when a Pokémon is selected
		});
		autoCompleteDiv.appendChild(div);
	});
}

function searchPokemon(query) {
	const pokeUrl = `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`;

	fetch(pokeUrl)
		.then((res) => {
			if (!res.ok) {
				if (res.status === 404) {
					throw new Error("No Pokémon found with that name!");
				} else {
					throw new Error("An error occurred while fetching the data.");
				}
			}
			return res.json();
		})
		.then((data) => {
			reset();
			displayPokemonData(data);
		});
}

// Function to display Pokémon data on the webpage
function displayPokemonData(data) {
	const dataTypes = data.types;
	const dataFirstType = dataTypes[0];
	const dataSecondType = dataTypes[1];
	pokeFirstType.textContent = dataFirstType.type.name;

	if (dataSecondType) {
		pokeSecondType.classList.remove("d-none");
		pokeSecondType.textContent = dataSecondType.type.name;
	} else {
		pokeSecondType.classList.add("d-none");
		pokeSecondType.textContent = "";
	}

	pokeImage.src = data.sprites.front_default || "";
	pokeName.textContent = data.name;
	pokeId.textContent = "#" + data.id.toString().padStart(3, "0");
}

// Get data for all pokemon
function getAll() {
	// Create variable for random number generation
	let random = Math.floor(Math.random() * 151);

	// Create URL from random number
	let pokeUrl = `https://pokeapi.co/api/v2/pokemon/${random}`;

	// GET request using fetch for data of individual pokemon
	fetch(pokeUrl)
		.then((res) => res.json())
		.then((data) => {
			// Shows data of pokemon on screen
			reset();

			// Get the data types
			const dataTypes = data.types;
			const dataFirstType = dataTypes[0];
			const dataSecondType = dataTypes[1];
			pokeFirstType.textContent = dataFirstType.type.name;

			// If there are more than 1 type remove hide class vice versa
			if (dataSecondType) {
				pokeSecondType.classList.remove("d-none");
				pokeSecondType.textContent = dataSecondType.type.name;
			} else {
				pokeSecondType.classList.add("d-none");
				pokeSecondType.textContent = "";
			}

			// If there is no image put blank
			pokeImage.src = data.sprites.front_default || "";

			pokeName.textContent = data.name;

			// Put # in front of number, convert to string, then add "0" in front of it if less than 100
			pokeId.textContent = "#" + data.id.toString().padStart(3, "0");
		});
}

// Fetch the list of all Pokémon names when the script loads
fetchPokemonList();

// Call the function to add the search bar when the script loads
addSearchBar();
