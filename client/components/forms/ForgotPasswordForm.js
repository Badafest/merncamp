import { SyncOutlined } from "@ant-design/icons";

const ForgotPasswordForm = ({
  handleSubmit,
  email,
  setEmail,
  newPassword,
  setNewPassword,
  secret,
  setSecret,
  loading,
}) => (
  <form onSubmit={handleSubmit}>
    <div className="form-group p-2">
      <small>
        <label className="text-muted">Your Email Address</label>
      </small>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        className="form-control"
        placeholder="john@example.com"
      />
    </div>

    <div className="form-group p-2">
      <small>
        <label className="text-muted">Enter New Password</label>
      </small>
      <input
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        type="password"
        className="form-control"
        placeholder="Never share your password."
      />
    </div>

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

    <div className="form-group p-2">
      <button
        disabled={!email || !secret || !newPassword || loading}
        className="btn btn-success col-12"
      >
        {loading ? <SyncOutlined spin className="py-1" /> : "Submit"}
      </button>
    </div>
  </form>
);

export default ForgotPasswordForm;
