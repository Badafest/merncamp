import { SyncOutlined } from "@ant-design/icons";

const AuthForm = ({
  handleSubmit,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  secret,
  setSecret,
  username,
  setUsername,
  about,
  setAbout,
  loading,
  page,
}) => (
  <form onSubmit={handleSubmit}>
    {page === "profileUpdate" && (
      <>
        <div className="form-group p-2">
          <small>
            <label className="text-muted">Username</label>
          </small>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Your username [visible to public]"
          />
        </div>
        <div className="form-group p-2">
          <small>
            <label className="text-muted">About you</label>
          </small>
          <input
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Describe yourself in short. Dont be shy :)"
          />
        </div>
      </>
    )}

    {page !== "login" && (
      <div className="form-group p-2">
        <small>
          <label className="text-muted">Your Name</label>
        </small>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="form-control"
          placeholder="Enter full name"
        />
      </div>
    )}

    <div className="form-group p-2">
      <small>
        <label className="text-muted">Your Email Address</label>
      </small>
      <input
        disabled={page === "profileUpdate"}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        className="form-control"
        placeholder="john@example.com"
      />
    </div>

    <div className="form-group p-2">
      <small>
        <label className="text-muted">Enter Password</label>
      </small>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        className="form-control"
        placeholder="Never share your password."
      />
    </div>

    {page !== "login" && (
      <>
        <div className="form-group">
          <small>
            <label className="text-muted">Pick a Security Question</label>
          </small>
          <select className="form-control">
            <option>What is your favourite food?</option>
            <option>What is your best freind's name?</option>
            <option>What is your place of birth?</option>
            <option>What city were your born in?</option>
          </select>

          <small className="form-text text-muted">
            You can use this to reset your password.
          </small>
        </div>

        <div className="form-group p-2">
          <input
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Answer to your security question."
          />
        </div>
      </>
    )}

    <div className="form-group p-2">
      <button
        disabled={
          page === "profileUpdate"
            ? loading
            : page === "login"
            ? !email || !password || loading
            : !name || !email || !secret || !password || loading
        }
        className="btn btn-success col-12"
      >
        {loading ? <SyncOutlined spin className="py-1" /> : "Submit"}
      </button>
    </div>
  </form>
);

export default AuthForm;
