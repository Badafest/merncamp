import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import AuthForm from "../../../components/forms/AuthForm";
import { UserContext } from "../../../context";
import UserRoute from "../../../components/routes/UserRoute";
import { useRouter } from "next/router";

import { Avatar } from "antd";
import { CameraOutlined, LoadingOutlined } from "@ant-design/icons";

const ProfileUpdate = () => {
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  // profile image
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);

  const [state, setState] = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (state && state.user) {
      setUsername(state.user.username);
      setAbout(state.user.about);
      setName(state.user.name);
      setEmail(state.user.email);
      setImage(state.user.image);
    }
  }, [state && state.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put("/profile-update", {
        username,
        about,
        name,
        email,
        password,
        secret,
        image,
      });
      console.log("UPDATED=>", data);
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        // update local storage, update user, keep token
        let auth = JSON.parse(localStorage.getItem("auth"));
        auth.user = data;
        localStorage.setItem("auth", JSON.stringify(auth));
        // update context
        setState({ ...state, user: data });
        setOk(true);
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
    // console.log(name, email, password, secret);
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
  // redirect logged out user [eg: when typing '../user/profile' in url]
  //   if (!state || !state.user || !state.token) router.push("/");

  return (
    <UserRoute>
      <div className="container-fluid">
        <div className="row py-5 bg-default-img text-light">
          <div className="col text-center">
            <h1>Profile</h1>
          </div>
        </div>

        <div className="row py-5">
          <div className="col-md-6 offset-md-3">
            {/* upload image */}
            <div className="text-center h5">
              <label>
                {image && image.url ? (
                  <Avatar size={30} src={image.url} className="mt-1" />
                ) : uploading ? (
                  <LoadingOutlined className="mt-1" />
                ) : (
                  <CameraOutlined className="mt-1" />
                )}

                <input
                  onChange={handleImage}
                  type="file"
                  accept="image/*"
                  hidden
                />
              </label>
            </div>
            <AuthForm
              handleSubmit={handleSubmit}
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              secret={secret}
              setSecret={setSecret}
              username={username}
              setUsername={setUsername}
              about={about}
              setAbout={setAbout}
              loading={loading}
              page="profileUpdate"
            />
          </div>
        </div>
        <div classsName="row">
          <div className="col">
            <Modal
              title="Congratulations!"
              visible={ok}
              onCancel={() => {
                setOk(false);
              }}
              footer={null}
            >
              <p>You have successfully updated your profile.</p>
            </Modal>
          </div>
        </div>
      </div>
    </UserRoute>
  );
};

export default ProfileUpdate;
