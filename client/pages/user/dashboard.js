import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import PostForm from "../../components/forms/PostForm";
import CommentForm from "../../components/forms/CommentForm";
import Search from "../../components/Search";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import PostList from "../../components/cards/PostList";
import People from "../../components/cards/People";
import Link from "next/link";
import { Modal, Pagination } from "antd";

const Home = () => {
  const [state, setState] = useContext(UserContext);

  // state
  const [content, setContent] = useState("");

  // image
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  // posts
  const [posts, setPosts] = useState([]);

  // people
  const [people, setPeople] = useState([]);

  // comment
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState();

  // pagination
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);

  // router
  const router = useRouter();

  useEffect(() => {
    if (state && state.token) {
      newsFeed();
      findPeople();
    }
  }, [state && state.token, page]);

  useEffect(() => {
    if (state && state.token) {
      axios.get("/total-posts").then((data) => {
        setTotalPosts(data.data);
      });
    }
  }, [state && state.token]);

  const findPeople = async () => {
    try {
      const { data } = await axios.get("/find-people");
      setPeople(data);
    } catch (err) {
      console.log(err);
    }
  };

  const newsFeed = async () => {
    try {
      const { data } = await axios.get(`/news-feed/${page}`);
      console.log(data);
      setPosts(data.posts);
    } catch (err) {
      console.log(err);
    }
  };

  const postSubmit = async (evt) => {
    evt.preventDefault();
    // console.log("post=>", content);
    try {
      const { data } = await axios.post("/create-post", { content, image });
      console.log(data);
      if (data.error) {
        toast.error(data.error);
      } else {
        setPage(1);
        toast.success("Post created");
        setContent("");
        setImage({});
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleImage = async (evt) => {
    const file = evt.target.files[0];
    let formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const { data } = await axios.post("/upload-image", formData);
      setImage({
        url: data.url,
        public_id: data.public_id,
      });
      console.log(data);
      setUploading(false);
    } catch (err) {
      setUploading(false);
      console.log(err);
    }
  };

  const handleDelete = async (post) => {
    try {
      const answer = confirm("Are you sure?");
      if (!answer) return;
      const { data } = await axios.delete(`/delete-post/${post._id}`);
      toast.error("Post Deleted!");
      newsFeed();
    } catch (err) {
      console.log(err);
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
      let filtered = people.filter((person) => person._id !== user._id);
      setPeople(filtered);
      //rerender the posts in news feed
      newsFeed();
      toast.success(`Following ${user.username}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async (post_id) => {
    try {
      const { data } = await axios.put("/like-post", { _id: post_id });
      newsFeed();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnlike = async (post_id) => {
    try {
      const { data } = await axios.put("/unlike-post", { _id: post_id });
      newsFeed();
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = (post) => {
    setCurrentPost(post);
    setVisible(true);
  };

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/add-comment", {
        post_id: currentPost._id,
        comment,
      });
      // console.log(data);
      setComment("");
      setVisible(false);
      newsFeed();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <UserRoute>
      <div className="container-fluid">
        <div className="row py-5 bg-default-img text-light">
          <div className="col text-center">
            <h1>News Feed</h1>
          </div>
        </div>

        <div className="row py-3">
          <div className="col-md-8">
            <PostForm
              content={content}
              setContent={setContent}
              postSubmit={postSubmit}
              handleImage={handleImage}
              uploading={uploading}
              image={image}
            />
            <br />
            <PostList
              posts={posts}
              handleDelete={handleDelete}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
              handleComment={handleComment}
            />
            <Pagination
              current={page}
              pageSize={3}
              total={totalPosts}
              onChange={(value) => setPage(value)}
              className="pb-5"
            />
          </div>

          <div className="col-md-4">
            <Search />
            <br />
            {state && state.user && state.user.following && (
              <Link href={"/user/following"}>
                <a className="h6">{state.user.following.length} Following</a>
              </Link>
            )}
            <People people={people} handleFollow={handleFollow} />
          </div>
        </div>
        <Modal
          visible={visible}
          onCancel={() => {
            setVisible(false);
          }}
          title="Comment"
          footer={null}
        >
          <CommentForm
            comment={comment}
            setComment={setComment}
            addComment={addComment}
          />
        </Modal>
      </div>
    </UserRoute>
  );
};

export default Home;
