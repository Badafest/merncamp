import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import UserRoute from "../../../components/routes/UserRoute";
import PostForm from "../../../components/forms/PostForm";
import { toast } from "react-toastify";

const EditPost = () => {
  const router = useRouter();
  const _id = router.query._id;
  const [post, setPost] = useState({});

  //state
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (_id) fetchPost();
  }, [_id]);

  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`/user-post/${_id}`);
      setPost(data);
      setContent(data.content);
      setImage(data.image);
    } catch (err) {
      console.log(err);
    }
  };

  const postSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const { data } = await axios.put(`/update-post/${_id}`, {
        content,
        image,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Post Updated");
        router.push("/user/dashboard");
      }
    } catch (error) {
      console.log(error);
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

  return (
    <UserRoute>
      <div className="container-fluid">
        <div className="row py-5 bg-default-img text-light">
          <div className="col text-center">
            <h1>Edit Post</h1>
          </div>
        </div>

        <div className="row py-3">
          <div className="col-md-8 offset-md-2">
            <PostForm
              content={content}
              setContent={setContent}
              postSubmit={postSubmit}
              handleImage={handleImage}
              uploading={uploading}
              image={image}
            />
          </div>
        </div>
      </div>
    </UserRoute>
  );
};

export default EditPost;
