import SinglePost from "./SinglePost";

const PostList = ({
  posts,
  handleDelete = () => {},
  handleLike = () => {},
  handleUnlike = () => {},
  handleComment = () => {},
}) => {
  return (
    <>
      {posts &&
        posts.map((post) => (
          <SinglePost
            key={post._id}
            post={post}
            handleDelete={handleDelete}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            handleComment={handleComment}
          />
        ))}
    </>
  );
};

export default PostList;
