import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classes from "./Favorites.module.css";
import AuthContext from "../context/AuthProvider";
import ItemList from "../Items/ItemList";
import { addItemToOrder, getFavorites, removeFavorite } from "../services/api";

function Favourites() {
  const { auth } = useContext(AuthContext);

  const [favoriteItems, setFavoriteItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    if (!e.res) {
      setErrMsg("No server response");
    } else if (e.res.status == 403) {
      setErrMsg("Please log in again");
    } else {
      setErrMsg(e.res.data);
    }
  };

  useEffect(() => {
    if (!auth) return;

    getFavorites(authHeaders()).then((res) => {
      setFavoriteItems(res.data);
      setIsLoading(false);
    });
  }, [auth]);

  const favoriteHandler = (item) => {
    removeFavorite(item.itemId, authHeaders())
      .then(() => {
        setFavoriteItems(
          favoriteItems.filter(
            (favoriteItems) => favoriteItems.item !== item.itemId,
          ),
        );
        showSuccess(`${item.title} has been removed from your favorites`);
      })
      .catch(handleError);
  };

  const addToOrderHandler = (item) => {
    addItemToOrder(item.itemId, authHeaders())
      .then(() => {
        showSuccess(`${item.title} has beedn added to your order`);
      })
      .catch(handleError);
  };

  if (!auth) {
    return (
      <section className={classes.signIn}>
        <h1>My Favorites</h1>
        <Link to="/login">Please Sign In</Link>
      </section>
    );
  }

  const favoriteIds = favoriteItems.map((item) => item.itemId);

  return (
    <>
      <h1 className={classes.title}>My Favorites</h1>

      <p className={errMsg ? classes.errmsg : "offscreen"}>{errMsg}</p>
      <p className={successMsg ? classes.successmsg : "offscreen"}>
        {successMsg}
      </p>

      {isLoading ? (
        <p className={classes.fallback}>Loading...</p>
      ) : favoriteItems.length === 0 ? (
        <p className={classes.fallback}>
          Your favorites list is empty! <Link to="/">Add something now</Link>
        </p>
      ) : (
        <ItemList
          item={favoriteItems}
          favoriteIds={favoriteIds}
          onFavoriteHandler={favoriteHandler}
          onAddToOrderHandler={addToOrderHandler}
        ></ItemList>
      )}
    </>
  );
}

export default Favourites;
