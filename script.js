let pokemonAmount = 40; // The number of Pokémon to be displayed at once
let offset = 0; // Offset to track the current position in the Pokémon list
let loading = false; // Flag to indicate if Pokémon data is currently being loaded
let isRendering = false; // Flag to indicate if the rendering process is ongoing
let loadedPokemon = new Set(); // Set to track already loaded Pokémon to avoid duplicates
let maxOffset = 151; // Maximum number of Pokémon to load
let openPopup = false; // Flag to indicate if a popup is open
let pokemonDataCache = []; // Array to cache Pokémon data for faster access
let pokedexEntry; // Variable to store the current Pokémon entry being viewed
let abount = false; // Flag to indicate if the "About" section is being viewed
let searching = false; // Flag to indicate if a search is in progress
let maxValue = 250; // Variable to store the maximum value of Pokémon stats
valueMax(); // Initialize the maxValue variable
const typeToImageMap = {
  normal: "./img/normal.svg",
  fire: "./img/fire.svg",
  water: "./img/water.svg",
  grass: "./img/grass.svg",
  electric: "./img/electric.svg",
  ice: "./img/ice.svg",
  fighting: "./img/fighting.svg",
  poison: "./img/poison.svg",
  ground: "./img/ground.svg",
  flying: "./img/flying.svg",
  psychic: "./img/psychic.svg",
  bug: "./img/bug.svg",
  rock: "./img/rock.svg",
  ghost: "./img/ghost.svg",
  dragon: "./img/dragon.svg",
  dark: "./img/dark.svg",
  steel: "./img/steel.svg",
  fairy: "./img/fairy.svg",
};

// Preload Pokémon data and cache it
async function preloadPokemonData() {
  for (let i = 1; i <= maxOffset; i++) {
    try {
      let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
      if (!response.ok) throw new Error(`Fehler beim Abrufen der Pokémon-Daten: ${response.status}`);
      let data = await response.json();
      pokemonDataCache.push(data);
    } catch (error) {
      console.error(error);
    }
  }
}

// Calculate the maximum value of Pokémon stats
async function valueMax() {
  let allValues = [];
  for (let i = 1; i < maxOffset; i++) {
    let pokedexEntrys = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    let pokedexEntry = await pokedexEntrys.json();
    for (let j = 0; j < pokedexEntry["stats"].length; j++) {
      let singleStats = pokedexEntry["stats"][j]["base_stat"];
      allValues.push(singleStats);
    }
  }
  maxValue = Math.max(...allValues);
}

// Render the Pokémon index
async function renderPokedexIndex() {
  if (isRendering) return;
  isRendering = true;
  loading = true;
  document.getElementById("popup").classList.add("d-none");
  document.getElementById("content").innerHTML += "";
  for (let i = offset + 1; i <= Math.min(offset + pokemonAmount, maxOffset); i++) {
    if (offset > maxOffset || searching) {
      loading = false;

      return;
    }
    if (loadedPokemon.has(i)) continue;
    let { pokedexEntry, imageSrc, classForBackgroundColor } = await imgAndBackgroundColor(i);
    document.getElementById("content").innerHTML += renderPokedexIndexHTML(pokedexEntry, i, imageSrc, classForBackgroundColor);
    pokemonTypes(pokedexEntry, i);
    loadedPokemon.add(i);
  }
  offset += pokemonAmount;
  loading = false;
  isRendering = false;
}

async function imgAndBackgroundColor(i) {
  let pokedexEntrys = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
  let pokedexEntry = await pokedexEntrys.json();
  let imageSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${i}.png`;
  let classForBackgroundColor = pokedexEntry["types"][0]["type"]["name"];
  return { pokedexEntry, imageSrc, classForBackgroundColor };
}

function renderPokedexIndexHTML(pokedexEntry, i, imageSrc, classForBackgroundColor) {
  return /*html*/ `
  <div class="singlePokemon" id="singlePokemon" onclick="popupSinglePokemon(${i}, event)">
                <div class="indexAndName">
                    <span id="pokemonIndex">#${pokedexEntry["id"]}</span>
                    <span id="pokemonName">${pokedexEntry["forms"][0]["name"]}</span>
                </div>
                <div class="pokemonImage">
                   <img class=${classForBackgroundColor} src=${imageSrc} alt=${classForBackgroundColor}>
                </div>
                <div class="art" id="art${i}">
                </div>
            </div>
`;
}

// Display the types of a Pokémon as icons
function pokemonTypes(pokedexEntry, i) {
  for (let j = 0; j < pokedexEntry["types"].length; j++) {
    let typeName = pokedexEntry["types"][j]["type"]["name"];
    let typeIcon = typeToImageMap[typeName];
    document.getElementById(`art${i}`).innerHTML += /*html*/ `
    <img class=${typeName} src=${typeIcon} alt=${typeName}>
    `;
  }
}

// Display a popup with detailed Pokémon information
async function popupSinglePokemon(i, event) {
  loading = true;
  abount = false;
  hideClick(event);
  let { pokedexEntry, imageSrc, classForBackgroundColor } = await imgAndBackgroundColor(i);
  document.getElementById("popup").classList.remove("d-none");
  document.getElementById("popup").innerHTML = popupSinglePokemonHTML(pokedexEntry, i, classForBackgroundColor, imageSrc);

  document.getElementById("leftArrow").classList.remove("d-none");
  if (i == 1) {
    document.getElementById("leftArrow").classList.add("d-none");
  }
  if (i == maxOffset) {
    document.getElementById("rightArrow").classList.add("d-none");
  }
  pokemonStats(i, event);
}

function popupSinglePokemonHTML(pokedexEntry, i, classForBackgroundColor, imageSrc) {
  return /*html*/ `
  <div class="overallPopup">
    <img class="arrow" id="leftArrow" onclick="previousPokemon(${i}, event)" src="./img/arrow_circle_left.svg" alt="">
    <div class="pokemonPopup" onclick="hideClick(event)">
      <div class="indexAndNamePopUp">
        <span id="pokemonNamePopUp">${pokedexEntry["forms"][0]["name"]}</span>
      </div>
      <div class="pokemonImagePopup">
        <img class=${classForBackgroundColor} src=${imageSrc} alt="">
      </div>
      <div class="popupTab">
        <div class="singlePopupTab" id="button1" onclick="about(${i}, event)">About</div>
        <div class="singlePopupTabMiddle" id="statsButton" onclick="if(!this.disabled) { pokemonStats(${i}, event); this.disabled = true; }"><span>stats</span></div>
        <div class="singlePopupTab" onclick=""></div>
      </div>
      <div class="artPopup" id="artPopup">
        <div class="chart" id="chart"></div>
      </div>
  </div>
  <img class="arrow" id="rightArrow" onclick="nextPokemon(${i}, event)" src="./img/arrow_circle_right.svg" alt="">`;
}

// Display Pokémon stats in a chart
async function pokemonStats(i, event) {
  hideClick(event);
  if (abount) {
    popupSinglePokemon(i, event);
  } else {
    document.getElementById("chart").innerHTML = "";
    document.getElementById("statsButton").style.backgroundColor = "rgb(66, 59, 59)";
    let { pokedexEntry } = await imgAndBackgroundColor(i); //only the individual Pokedex entry is taken here
    let values = [];
    let labels = [];
    for (let j = 0; j < pokedexEntry["stats"].length; j++) {
      let singleStats = pokedexEntry["stats"][j]["base_stat"];
      let statLabels = pokedexEntry["stats"][j]["stat"]["name"];
      values.push(singleStats);
      labels.push(statLabels);
      labels[j] = labels[j].replace("attack", "Att").replace("defensse", "Def").replace("special-Att", "sp-att").replace("special-defense", "sp-def");
    }

    renderStatsChart(values, labels, maxValue);
  }
}

function renderStatsChart(values, labels, maxValue) {
  const chart = document.getElementById("chart");

  values.forEach((value, index) => {
    const barContainer = document.createElement("div");
    barContainer.className = "bar-container";

    const barLabel = document.createElement("div");
    barLabel.className = "bar-label";
    barLabel.innerText = labels[index];

    const barWrapper = document.createElement("div");
    barWrapper.className = "bar-wrapper";

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.width = `${(value / maxValue) * 100}%`;

    const barValue = document.createElement("span");
    barValue.className = "bar-value";
    barValue.innerText = value;

    barWrapper.appendChild(bar);
    barWrapper.appendChild(barValue);
    barContainer.appendChild(barLabel);
    barContainer.appendChild(barWrapper);
    chart.appendChild(barContainer);
  });
}

// Close the popup
function closePopUp() {
  document.getElementById("popup").classList.add("d-none");
  document.body.classList.remove("scrolling");
  document.body.classList.add("scrolling2");
  loading = false;
}

// Prevent event propagation
function hideClick(event) {
  event.stopPropagation();
}

// Display the next Pokémon in the popup
function nextPokemon(i, event) {
  event.stopPropagation();
  i++;
  popupSinglePokemon(i, event);
}

// Display the previous Pokémon in the popup
function previousPokemon(i, event) {
  event.stopPropagation();
  i--;
  popupSinglePokemon(i, event);
}

// Display the "About" section of a Pokémon
async function about(i, event) {
  hideClick(event);
  abount = true;
  let { pokedexEntry } = await imgAndBackgroundColor(i); //only the individual Pokedex entry is taken here
  document.getElementById("artPopup").innerHTML = "";
  document.getElementById("statsButton").style.backgroundColor = "rgb(97, 93, 93)";
  document.getElementById("button1").style.backgroundColor = "rgb(66, 59, 59)";
  let pokedexSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${i}`);
  let pokedexSpecie = await pokedexSpecies.json();
  let description = pokedexSpecie["flavor_text_entries"]["2"]["flavor_text"];
  description = description.replace(/[\n\f]/g, " ");
  document.getElementById("artPopup").innerHTML = aboutHTML(pokedexEntry, description);
}

function aboutHTML(pokedexEntry, description) {
  return /*html*/ `
  <div class="about">
    <div class="description">${description}</div>
    <div class="pokemonHeight"><span>Height:</span>${(pokedexEntry["height"] * 10) / 100} m</div>
    <div class="pokemonWeight"><span>Weigth:</span>${(pokedexEntry["weight"] * 100) / 1000} kg</div>
  </div> 
  `;
}

// Search for a Pokémon by name
function searchPokemon() {
  searching = true;
  let search = document.getElementById("search").value;
  if (search.length > 2) {
    search = search.toLowerCase();
    document.getElementById("content").innerHTML = /*html*/ `
      <a href="index.html" class="allPokemonLink">All Pokemon</a>`;
    pokemonDataCache.forEach((pokedexEntry) => {
      let name = pokedexEntry["forms"][0]["name"];
      if (name.includes(search)) {
        let imageSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokedexEntry["id"]}.png`;
        let classForBackgroundColor = pokedexEntry["types"][0]["type"]["name"];
        document.getElementById("content").innerHTML += searchPokemonHTML(pokedexEntry, name, imageSrc, classForBackgroundColor);
        pokemonTypes(pokedexEntry, pokedexEntry["id"]);
      }
    });
  }
}

function searchPokemonHTML(pokedexEntry, name, imageSrc, classForBackgroundColor) {
  return /*html*/ `
  <div class="singlePokemonSearch" onclick="popupSinglePokemon(${pokedexEntry["id"]}, event)">
    <div class="indexAndName">
      <span id="pokemonIndex">#${pokedexEntry["id"]}</span>
      <span id="pokemonName">${name}</span>
    </div>
    <div class="pokemonImage">
      <img class=${classForBackgroundColor} src=${imageSrc} alt="">
    </div>
    <div class="artSearch" id="art${pokedexEntry["id"]}">
    </div>
  </div>`;
}

// Infinite scrolling functionality
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading) {
    if (isEndOfPage()) {
      loading = true;
      renderPokedexIndex();
    }
  }
});

// Check if the user has scrolled to the end of the page
function isEndOfPage() {
  return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;
}
