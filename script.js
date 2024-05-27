function render() {}


async function renderPokedexIndex() {
  for (let i = 1; i < 152; i++) {
    let pokedexEntrys = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    let pokedexEntry = await pokedexEntrys.json();
    let imageSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${i}.png`
    let classForBackgroundColor = pokedexEntry["types"][0]["type"]["name"]
  document.getElementById("content").innerHTML += /*html*/ `
  <div class="singlePokemon">
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
console.log(pokedexEntry["types"][0]["type"]["name"]);
pokemonTypes(pokedexEntry, i, classForBackgroundColor);
}
}


function pokemonTypes(pokedexEntry, i, ){
    console.log(pokedexEntry["types"][0]["type"]["name"]);

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
        fairy: "./img/fairy.svg"
    }
    for (let j = 0; j < pokedexEntry["types"].length; j++){
        let typeName = pokedexEntry["types"][j]["type"]["name"];
        let typeIcon = typeToImageMap[typeName];
        document.getElementById(`art${i}`).innerHTML +=  /*html*/ `
    <img class=${typeName} src=${typeIcon} alt=${typeName}>
    `;
    }
}