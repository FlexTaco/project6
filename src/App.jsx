import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import RightList from "./components/RightList";
import React from "react";
import { Outlet, Link } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(Math.floor(Math.random() * 1000));
  const [mostFrequentType, setMostFrequentType] = useState(null);
  const frequent = {};
  const attack = [];
  const labels = [];
  // Fetch Pokémon data with details
  useEffect(() => {
    const fetchItems = async (offset) => {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/?limit=15&offset=${offset}`
        );
        const data = response.data.results;

        // Create an array of promises to fetch details for each Pokémon
        const promises = data.map(async (pokemon) => {
          const response = await axios.get(pokemon.url);
          return response.data;
        });

        // Wait for all promises to resolve and set the Pokémon details
        const pokemonDetails = await Promise.all(promises);

        // Update the state with Pokémon details
        setItems(pokemonDetails);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };

    fetchItems(offset);
  }, [offset]);

  useEffect(() => {
    if (items.length > 0) {
      const typeCount = {};
      let maxType = null;
      let maxCount = 0;

      items.forEach((pokemon) => {
        const typeName = pokemon.types[0].type.name;
        if (typeCount[typeName]) {
          typeCount[typeName]++;
        } else {
          typeCount[typeName] = 1;
        }

        if (typeCount[typeName] > maxCount) {
          maxCount = typeCount[typeName];
          maxType = typeName;
        }
      });

      setMostFrequentType(maxType);
    }
  }, [items]);

  for (let i = 0; i < items.length; i++) {
    if (frequent[items[i].types[0].type.name]) {
      frequent[items[i].types[0].type.name] += 1;
    } else {
      frequent[items[i].types[0].type.name] = 1;
    }
    attack.push(items[i].stats[0].base_stat);
  }

  const data = {
    labels: Object.keys(frequent),
    datasets: [
      {
        label: "# of Votes",
        data: Object.values(frequent),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(125, 159, 64, 0.2)",
          "rgba(75, 67, 109, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(125, 159, 64, 1)",
          "rgba(75, 67, 109, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Pokemon Types",
      },
    },
  };

  const options2 = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Pokemon Attack Stats",
      },
    },
  };

  for (let i = 0; i < items.length; i++) {
    labels.push(items[i].name);
  }

  const data2 = {
    labels,
    datasets: [
      {
        label: "Attack Stats",
        data: attack,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <>
      <div className="stats">
        <div className="statcontainer">
          <h3># of Pokémons</h3>
          <p>{items.length}</p>
        </div>
        <div className="statcontainer">
          <h3>Average Weight</h3>
          <p>
            {Math.round(
              items.reduce((a, b) => a + b.weight, 0) / items.length
            ) / 100}{" "}
            hectogram
          </p>
        </div>
        <div className="statcontainer">
          <h3>Most Frequent Type</h3>
          <p>{mostFrequentType}</p>
        </div>

        <div className="container"></div>
      </div>
      <div className="checkList">
        <h1>Pokémons</h1>
        <p>Check out these pokemons!</p>
        <form action="">
          <label htmlFor="">Search: </label>
          <input type="text" placeholder="enter name" />
        </form>
        <div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Weight</th>
                <th>Type</th>
                <th>Attack</th>
                <th>Read More</th>
              </tr>
            </thead>
            <tbody>
              {items.map((x) => (
                <tr key={x.id}>
                  <td>{x.name}</td>
                  <td>{x.weight}</td>
                  <td>{x.types[0].type.name}</td>
                  <td>{x.stats[0].base_stat}</td>
                  <td>
                    <Link to={`/pokemon/${x.name}`}>About Me</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br />
        <div id="Graph">
          <Pie id="bar" options={options} data={data} />
          <br />
          <Line id="line" options={options2} data={data2} />
        </div>
      </div>
      <RightList />
    </>
  );
}

export default App;
