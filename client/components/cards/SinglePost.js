import renderHTML from "react-render-html";
import moment from "moment";
import { Avatar } from "antd";
import PostImage from "../images/PostImage";
import {
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useContext } from "react";
import { UserContext } from "../../context";
import { useRouter } from "next/router";
import Link from "next/link";

const SinglePost = ({
  post,
  handleDelete = () => {},
  handleLike = () => {},
  handleUnlike = () => {},
  handleComment = () => {},
  commentsCount = 2,
  removeComment = () => {},
}) => {
  // console.log(posts);
  const [state] = useContext(UserContext);
  const router = useRouter();

  return (
    <>
      {post && post.postedBy && (
        <div key={post._id} className="card mb-5">
          <div className="card-header">
            {post.postedBy.image ? (
              <Avatar size={40} src={post.postedBy.image.url}></Avatar>
            ) : (
              <Avatar size={40}>{post.postedBy.name[0]}</Avatar>
            )}

            <span className="pt-2 ml-3" style={{ marginLeft: "1rem" }}>
              {post.postedBy.name}
            </span>
            <span className="pt-2 ml-3" style={{ marginLeft: "1rem" }}>
              {moment(post.createdAt).fromNow()}
            </span>
          </div>
          <div className="card-body">{renderHTML(post.content)}</div>
          <div className="card-footer">
            {post.image && <PostImage url={post.image.url} />}
            <div className="d-flex justify-content-between">
              <div>
                {state &&
                state.user &&
                post.likes &&
                post.likes.includes(state.user._id) ? (
                  <HeartFilled
                    onClick={() => handleUnlike(post._id)}
                    className="text-danger m-1 h5"
                  />
                ) : (
                  <HeartOutlined
                    onClick={() => handleLike(post._id)}
                    className="text-danger m-1 h5"
                  />
                )}
                <span className="pt-3 px-1">
                  {post.likes.length > 1
                    ? post.likes.length + " likes"
                    : post.likes.length == 1
                    ? "1 like"
                    : "Like"}
                </span>
                <CommentOutlined
                  onClick={() => handleComment(post)}
                  className="text-danger m-1 h5"
                />
                <span className="pt-3 px-1">
                  <Link href={`/post/${post._id}`}>
                    <a>
                      {post.comments.length > 1
                        ? post.comments.length + " comments"
                        : post.comments.length == 1
                        ? "1 comment"
                        : "Comment"}
                    </a>
                  </Link>
                </span>
              </div>

              {state &&
                state.user &&
                state.user._id == post.postedBy._id &&
                handleDelete && (
                  <div>
                    <EditOutlined
                      onClick={() => router.push(`/user/post/${post._id}`)}
                      className="text-danger m-1 h5"
                    />
                    <span className="pt-3 px-1 mx-1">Edit</span>
                    <DeleteOutlined
                      onClick={() => handleDelete(post)}
                      className="text-danger m-1 h5"
                    />
                    <span className="pt-3 px-1 mx-1">Delete</span>
                  </div>
                )}
            </div>
          </div>
          {post.comments && post.comments.length ? (
            <ol className="list-group">
              {post.comments.slice(0, commentsCount).map((comment) => (
                <li
                  key={comment._id}
                  className="list-group-item d-flex justify-content-between align-items-start"
                >
                  <div className="ms-2 me-auto">
                    <div>
                      {comment.postedBy.image ? (
                        <Avatar
                          size={40}
                          src={comment.postedBy.image.url}
                        ></Avatar>
                      ) : (
                        <Avatar size={40}>{comment.postedBy.name[0]}</Avatar>
                      )}{" "}
                      <span>{comment.postedBy.name}</span>
                    </div>
                    <div className="mt-2">{comment.text}</div>
                  </div>
                  <span className="badge-rounded-pill text-muted">
                    {moment(comment.created).fromNow()}
                    {state &&
                      state.user &&
                      state.user._id === comment.postedBy._id &&
                      removeComment && (
                        <div className="ml-auto mt-1 text-center">
                          <DeleteOutlined
                            className="text-danger"
                            onClick={() => removeComment(post._id, comment)}
                          />
                        </div>
                      )}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            ""
          )}
        </div>
      )}
    </>
  );
};

export default SinglePost;
