import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const PokemonProfile = () => {
  const { name } = useParams(); // Get the Pokemon name from the URL parameter
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    // Fetch data for the specific Pokemon using the name from the URL
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((response) => {
        setPokemonData(response.data);
      })
      .catch((error) => {
        console.error(`Error fetching data for ${name}:`, error);
      });
  }, [name]);

  if (!pokemonData) {
    // You can display a loading indicator here
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">
      <h2 className="pokemonName">{pokemonData.name.toUpperCase()}</h2>
      <div>
        <p>Height: {pokemonData.height}dm</p>
        <p>Weight: {pokemonData.weight}hg</p>
        <p> Type: {pokemonData.types[0].type.name}</p>
        <p>Base Stat: {pokemonData.stats[0].base_stat}</p>
      </div>
      <img
        src={pokemonData.sprites.front_shiny}
        alt="picture of pokemon"
        className="checkImg"
      />
    </div>
  );
};

export default PokemonProfile;
