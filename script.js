async function renderPokedexIndex() {
  document.getElementById("popup").classList.add("d-none");
  for (let i = 1; i < 40; i++) {
    let pokedexEntrys = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    let pokedexEntry = await pokedexEntrys.json();
    let imageSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${i}.png`;
    let classForBackgroundColor = pokedexEntry["types"][0]["type"]["name"];
    document.getElementById("content").innerHTML += /*html*/ `
  <div class="singlePokemon" onclick="popupSinglePokemon(${i}, event)">
                <div class="indexAndName">
                    <span id="pokemonIndex">#${pokedexEntry["id"]}</span>
                    <span id="pokemonName">${pokedexEntry["forms"][0]["name"]}</span>
                </div>
                <div class="pokemonImage">
                   <img class=${classForBackgroundColor} src=${imageSrc} alt="">
                </div>
                <div class="art" id="art${i}">
                </div>
            </div>
`;
    pokemonTypes(pokedexEntry, i);
  }
}

function pokemonTypes(pokedexEntry, i) {
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
  for (let j = 0; j < pokedexEntry["types"].length; j++) {
    let typeName = pokedexEntry["types"][j]["type"]["name"];
    let typeIcon = typeToImageMap[typeName];
    document.getElementById(`art${i}`).innerHTML += /*html*/ `
    <img class=${typeName} src=${typeIcon} alt=${typeName}>
    `;
  }
}

async function popupSinglePokemon(i, event) {
  event.stopPropagation();
  let pokedexEntrys = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
  let pokedexEntry = await pokedexEntrys.json();
  let imageSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${i}.png`;
  let classForBackgroundColor = pokedexEntry["types"][0]["type"]["name"];
  document.getElementById("popup").classList.remove("d-none");
  document.getElementById("popup").innerHTML = /*html*/ `
  
  <div class="pokemonPopup" onclick="hideClick(event)">
  <div class="indexAndNamePopUp">
      <span id="pokemonNamePopUp">${pokedexEntry["forms"][0]["name"]}</span>
  </div>
  <div class="pokemonImagePopup">
     <img class=${classForBackgroundColor} src=${imageSrc} alt="">
  </div>
  <div class="popupReiter">
    <div class="singlePopupReiter" id="button1" onclick="">123</div>
    <div class="singlePopupReiterMiddle" id="statsButton" onclick="if(!this.disabled) { pokemonStats(${i}, event); this.disabled = true; }"><span>stats</span></div>
    <div class="singlePopupReiter" onclick=""></div>
  </div>
  <div class="artPopup" id="artPopup">
    <div class="chart" id="chart">
  </div>
</div>`;
}

async function pokemonStats(i, event) {
  event.stopPropagation();
  document.getElementById("chart").innerHTML = "";
  document.getElementById("statsButton").style.backgroundColor = "rgb(66, 59, 59)";
  let pokedexEntrys = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
  let pokedexEntry = await pokedexEntrys.json();
  let values = [];
  let labels = [];
  for (let j = 0; j < pokedexEntry["stats"].length; j++) {
    let singleStats = pokedexEntry["stats"][j]["base_stat"];
    let statLabels = pokedexEntry["stats"][j]["stat"]["name"];
    values.push(singleStats);
    labels.push(statLabels);
    labels[j] = labels[j].replace("attack", "Att").replace("defensse", "Def").replace("special-Att", "sp-att").replace("special-defense", "sp-def");
  }

  const maxValue = Math.max(...values);
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

function closePopUp() {
  document.getElementById("popup").classList.add("d-none");
}

function hideClick(event){
  event.stopPropagation();
}