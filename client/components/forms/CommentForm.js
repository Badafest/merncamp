const CommentForm = ({ addComment, comment, setComment }) => {
  return (
    <form onSubmit={(e) => addComment(e)}>
      <input
        className="form-control"
        type="text"
        placeholder="Write a comment"
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
        }}
      />
      <button className="btn btn-primary btn-sm btn-block mt-3">Submit</button>
    </form>
  );
};

export default CommentForm;
