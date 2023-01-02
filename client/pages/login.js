import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import AuthForm from "../components/forms/AuthForm";
import { useRouter } from "next/router";
import { UserContext } from "../context";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [state, setState] = useContext(UserContext);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/login", {
        email,
        password,
      });

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        setState({
          user: data.user,
          token: data.token,
        });

        //save in local storage
        window.localStorage.setItem("auth", JSON.stringify(data));
        router.push("/user/dashboard");
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
    // console.log(email, password);
  };

  // redirect logged in user [eg: when typing '../login' in url]
  if (state && state.user && state.token) router.push("/user/dashboard");

  return (
    <div className="container-fluid">
      <div className="row py-5 bg-default-img text-light">
        <div className="col text-center">
          <h1>Log In</h1>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 offset-md-3">
          <AuthForm
            handleSubmit={handleSubmit}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            page="login"
          />
        </div>
      </div>
      <div className="row">
        <div className="col-12 text-center">
          <Link href="/register">
            <a>Not yet registered? Register!</a>
          </Link>
        </div>
        <div className="col-12 text-center">
          <Link href="/forgot-password">
            <a>Forgot Password? Click here to Reset</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
