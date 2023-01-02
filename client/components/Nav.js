import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { UserContext } from "../context";
import { useRouter } from "next/router";
import { Avatar } from "antd";

const Nav = () => {
  const [current, setCurrent] = useState("");
  const [state, setState] = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logOut = () => {
    setState(null);
    window.localStorage.removeItem("auth");
    router.push("/");
  };

  return (
    <nav className="nav bg-dark d-flex justify-content-between">
      <Link href="/">
        <a className={`nav-link text-light ${current === "/" && "active"}`}>
          <Avatar src="/images/logo.jpg" />
          MERNCAMP
        </a>
      </Link>

      {state === null ? (
        <>
          <Link href="/login">
            <a
              className={`nav-link text-light ${
                current === "/login" && "active"
              }`}
            >
              Login
            </a>
          </Link>
          <Link href="/register">
            <a
              className={`nav-link text-light ${
                current === "/register" && "active"
              }`}
            >
              Register
            </a>
          </Link>
        </>
      ) : (
        <div className="dropdown">
          <a
            className="dropdown-toggle text-light nav-link"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {state && state.user && state.user.name}
          </a>
          <ul className="dropdown-menu">
            <li>
              <Link href="/user/dashboard">
                <a
                  className={`nav-link dropdown-item${
                    current === "/user/dashboard" && "active"
                  }`}
                >
                  Dashboard
                </a>
              </Link>
            </li>
            <li>
              <Link href="/user/profile/update">
                <a
                  className={`nav-link dropdown-item${
                    current === "/user/dashboard" && "active"
                  }`}
                >
                  Profile
                </a>
              </Link>
            </li>
            <li>
              <a
                onClick={logOut}
                className={`nav-link ${current === "/logout" && "active"}`}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Nav;
