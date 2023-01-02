import { useState, useContext } from "react";
import { UserContext } from "../context";
import axios from "axios";
import People from "./cards/People";
import { toast } from "react-toastify";

const Search = () => {
  const [state, setState] = useContext(UserContext);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);

  const searchUser = async (e) => {
    e.preventDefault();
    // console.log(`Find the user ${query} from db`);
    try {
      if (query.length == 0) {
        toast.error("Type username to search");
        return;
      }
      const { data } = await axios.get(`/search-user/${query}`);
      //   console.log("search user result => ", data);
      if (data.length == 0) {
        toast.error("No user found");
      }
      setResult(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollow = async (user) => {
    // console.log("Add " + user.username + " to following list");
    try {
      const { data } = await axios.put("/user-follow", { _id: user._id });
      //update local storage, update user, keep token
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      //update context
      setState({ ...state, user: data });
      //update people state
      let filtered = result.filter((person) => person._id !== user._id);
      setResult(filtered);
      toast.success(`Following ${user.username}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnfollow = async (user) => {
    try {
      const { data } = await axios.put("/user-unfollow", { _id: user._id });
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      //update context
      setState({ ...state, user: data });
      //update people state
      let filtered = result.filter((person) => person._id !== user._id);
      setResult(filtered);
      toast.error(`Unfollowed ${user.username}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <form className="form-inline row pt-2" onSubmit={searchUser}>
        <div className="col-8">
          <input
            onChange={(e) => {
              setQuery(e.target.value);
              setResult([]);
            }}
            value={query}
            className="form-control"
            type="search"
            placeholder="Search User"
          />
        </div>
        <div className="col-4">
          <button className="btn btn-outline-primary col-12" type="submit">
            Search
          </button>
        </div>
      </form>
      {result && result.length > 0 && (
        <People
          people={result}
          handleFollow={handleFollow}
          handleUnfollow={handleUnfollow}
        />
      )}
    </>
  );
};

export default Search;
