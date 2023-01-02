import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SinglePost from "../../components/cards/SinglePost";
import { RollbackOutlined } from "@ant-design/icons";
import Link from "next/link";

const PostComments = () => {
  const [post, setPost] = useState({});
  const router = useRouter();
  const _id = router.query._id;

  useEffect(() => {
    if (_id) fetchPost();
  }, [_id]);

  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`user-post/${_id}`);
      // console.log(data);
      setPost(data);
    } catch (err) {
      console.log(err);
    }
  };

  const removeComment = async (post_id, comment) => {
    // console.log(post_id, comment);
    try {
      let answer = confirm("Are you sure?");
      if (!answer) return;
      const { data } = await axios.put("/remove-comment", {
        post_id,
        comment,
      });
      fetchPost();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row py-5 bg-default-img text-light">
        <div className="col text-center">
          <h1>Mern Camp</h1>
        </div>
      </div>

      <div className="container pt-5">
        <SinglePost
          post={post}
          commentsCount={100}
          removeComment={removeComment}
        />
      </div>

      <Link href="/user/dashboard">
        <a className="d-flex justify-content-center p-5">
          <RollbackOutlined />
        </a>
      </Link>
    </div>
  );
};

export default PostComments;
