import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";
import { UserContext } from "../context";
import { useRouter } from "next/router";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const [state] = useContext(UserContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/forgot-password", {
        email,
        newPassword,
        secret,
      });
      console.log(data);
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        setEmail("");
        setNewPassword("");
        setSecret("");
        setOk(data.ok);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data);
      setLoading(false);
    }
    // console.log(name, email, password, secret);
  };

  // redirect logged in user [eg: when typing '../login' in url]
  //   if (state && state.user && state.token) router.push("/");

  return (
    <div className="container-fluid">
      <div className="row py-5 bg-default-img text-light">
        <div className="col text-center">
          <h1>Forgot Password</h1>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 offset-md-3">
          <ForgotPasswordForm
            handleSubmit={handleSubmit}
            email={email}
            setEmail={setEmail}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            secret={secret}
            setSecret={setSecret}
            loading={loading}
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
            <p>You can now log in with new password.</p>
            <Link href="/login">
              <a className="btn btn-primary btn-sm">Log In</a>
            </Link>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
