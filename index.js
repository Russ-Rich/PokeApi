//DOM OBJECTS
const pokeScreen = document.querySelector(".poke-screen");
const pokeName = document.querySelector(".poke-name");
const pokeId = document.querySelector(".poke-id");
const pokeImage = document.querySelector(".poke-image");
const pokeFirstType = document.querySelector(".poke-first-type");
const pokeSecondType = document.querySelector(".poke-second-type");
const nextPoke = document.querySelector(".poke-btn");

//ADDING EVENT LISTENERS
nextPoke.addEventListener("click", getAll);

//functions
const reset = () => {
	pokeScreen.classList.remove("d-none");
};

//get data for all pokemon
function getAll() {
	// create variable for random number generation
	let random = Math.floor(Math.random() * 151);

	//create url from random number
	let pokeUrl = `https://pokeapi.co/api/v2/pokemon/${random}`;

	//GET request using fetch for data of individual pokemon
	fetch(pokeUrl)
		.then((res) => res.json())
		.then((data) => {
			//shows data of pokemon on screen
			reset();

			//get the data types
			const dataTypes = data.types;
			const dataFirstType = dataTypes[0];
			const dataSecondType = dataTypes[1];
			pokeFirstType.textContent = dataFirstType.type.name;

			//if there are more than 1 type remove hide class vice versa
			if (dataSecondType) {
				pokeSecondType.classList.remove("d-none");
				pokeSecondType.textContent = dataSecondType.type.name;
			} else {
				pokeSecondType.classList.add("d-none");
				pokeSecondType.textContent = "";
			}

			// if there is no image put blank
			pokeImage.src = data.sprites.front_default || "";

			pokeName.textContent = data.name;

			// put # in front of number, convert to string, then add "0" in front of it if less than 100
			pokeId.textContent = "#" + data.id.toString().padStart(3, "0");
		});
}
