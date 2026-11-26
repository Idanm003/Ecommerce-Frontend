import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesRight,
  faArrowRight,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import classes from "./Home.module.css";
import AuthContext from "../context/AuthProvider";
import SearchBar from "../SearchBar/SearchBar";
import ItemList from "../Items/ItemList";
import {
  addFavorite,
  addItemToOrder,
  getAllItems,
  getFavorites,
  removeFavorite,
  searchItems,
} from "../services/api";

const PROMOS = [
  {
    badge: "Hot Deal",
    title: "Headphones",
    subtitle: "Studio sound, all day comfort",
    search: "headphones",
    image: "/items/headphones.svg",
  },
  {
    badge: "New",
    title: "Laptops",
    subtitle: "Thin, light and powerful",
    search: "laptop",
    image: "/items/laptop.svg",
  },
  {
    badge: "Top Seller",
    title: "Smartwatches",
    subtitle: "Your health on your wrist",
    search: "watch",
    image: "/items/smartwatch.svg",
  },
  {
    badge: "Gaming",
    title: "Keyboards",
    subtitle: "Mechanical, fast and loud",
    search: "keyboard",
    image: "/items/keyboard.svg",
  },
];

function Home() {
  const { auth } = useContext(AuthContext);

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [favoriteIds, setFavoriteIds] = useState([]);

  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const authHeaders = () => ({
    Autherization: `Bearer ${auth}`,
  });

  const showSuccess = (message) => {
    setErrMsg("");
    setSuccessMsg(message);
  };

  const handleError = (e) => {
    setSuccessMsg("");
    if (!e.response) {
      setErrMsg("No Server Response");
    } else if (e.response.status === 403) {
      setErrMsg("Please log in again");
    } else {
      setErrMsg(e.response.data);
    }
  };

  const loadItems = (name) => {
    setIsLoading(true);
    const request = name ? searchItems(name) : getAllItems();

    request
      .then((res) => {
        setItems(res.data);
        setIsLoading(false);
      })

      .catch((e) => {
        handleError(e);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadItems("");
  }, []);

  (getFavorites(authHeaders())
    .then((res) => {
      const ids = res.data.map((item) => item.itemId);
      setFavoriteIds(ids);
    })
    .catch(handleError),
    [auth]);

  const searchHandler = (name) => {
    setSearchName(name);
    setErrMsg("");
    setSuccessMsg("");
    loadItems(name);
  };

  const favoriteHandler = (items) => {
    if (!auth) {
      setSuccessMsg("");
      setErrMsg("Please sing in to use the favorite list");
      return;
    }

    if (favoriteIds.includes(items.itemId)) {
      removeFavorite(item.itemId, authHeaders())
        .then(() => {
          setFavoriteIds(favoriteIds.filter((id) => id !== items.itemId));
          showSuccess(`${items.title} has been removed from favorites`);
        })
        .catch(handleError);
    } else {
      addFavorite(items.itemId, authHeaders())
        .then(() => {
          setFavoriteIds([...favoriteIds, items.itemId]);
          showSuccess(`${item.title} has beedn added to your favorites`);
        })
        .catch(handleError);
    }
  };

  const addToOrderHandler = (items) => {
    if (!auth) {
      setSuccessMsg("");
      setErrMsg("Please sign in to add items to an order");
      return;
    }

    addItemToOrder(items.itemId, authHeaders())
      .then(() => {
        showSuccess(`${items.title} has beedn added to your order`);
      })
      .catch(handleError);
  };

  return (
    <>
      <section className={classes.herp}>
        <div className={classes.heroText}>
          <span className={classes.herTag}>
            <FontAwesomeIcon icon={faFire} /> Season of tech deals
          </span>
          <h1>
            Upgrade your <span>setup.</span>
          </h1>
          <p>
            Headphones, laptops, smartphones and gaming gear at the best prices,
            with fast delivery and official warranty.
          </p>
          <a href="#items" className={classes.heroButton}>
            Shop now <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
        <img
          src="/hero.svg"
          alt="IM-Tech electronics"
          className={classes.heroImage}
        />
      </section>
    </>
  );
}

export default Home;
