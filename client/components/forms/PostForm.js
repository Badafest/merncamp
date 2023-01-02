import { Avatar } from "antd";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { CameraOutlined, LoadingOutlined } from "@ant-design/icons";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const PostForm = ({
  content,
  setContent,
  postSubmit,
  handleImage,
  uploading,
  image,
}) => {
  return (
    <div className="card">
      <div className="card-body pb-3"></div>
      <form className="form-group">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={(evt) => setContent(evt)}
          className="form-control"
          placeholder="Write Something..."
        />

        <div className="card-footer d-flex justify-content-between text-muted">
          <button
            disabled={!content.length}
            onClick={postSubmit}
            className="btn btn-sm btn-primary mt-1"
          >
            Post
          </button>
          <label>
            {image && image.url ? (
              <Avatar size={30} src={image.url} className="mt-1" />
            ) : uploading ? (
              <LoadingOutlined className="mt-1" />
            ) : (
              <CameraOutlined className="mt-1" />
            )}
            <input onChange={handleImage} type="file" accept="image/*" hidden />
          </label>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
