import { useState } from "react";
import "./searchBar.scss";
import { Link } from "react-router-dom";

const types = ["buy", "rent"];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "buy",
    location: "",
    minprice: 0,
    maxprice: 0,
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };
  const handlechange=(e)=>{
    setQuery((prev) => ({ ...prev,[e.target.name]:e.target.value }));

  }

  return (
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={query.type === type ? "active" : ""}
          >
            {type}
          </button>
        ))}
      </div>
      <form>
        <input type="text" name="city" placeholder="city" onChange={handlechange}/>
        <input
          type="number"
          name="minprice"
          min={0}
          max={10000000}
          placeholder="Min Price"
          onChange={handlechange}
        />
        <input
          type="number"
          name="maxprice"
          min={0}
          max={10000000}
          placeholder="Max Price"
          onChange={handlechange}
        />
        <Link to={`/list?&type=${query.type}&city=${query.city}&minprice=${query.minprice}&maxprice=${query.maxprice}`}>

        <button>
          <img src="/search.png" alt="" />
        </button>
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;
