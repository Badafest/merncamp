import ParallaxBG from "../../../components/cards/ParallaxBG";
import axios from "axios";
import SinglePost from "../../../components/cards/SinglePost";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";

const PublicPost = () => {
  const [post, setPost] = useState({});

  const router = useRouter();
  const { _id } = router.query;

  useEffect(() => {
    axios.get("/post/" + _id).then((res) => setPost(res.data));
  });

  const head = () => (
    <Head>
      <title>MERNCAMP - A social network by devs for devs</title>
      <meta name="description" content={`${post.content}`} />
      <meta
        property="og:description"
        content="A social network for devs by devs"
      />
      <meta property="og:type" content="webapp" />
      <meta property="og:site_name" content="MERNCAMP" />
      <meta
        property="og:url"
        content={`https://merncamp.com/post/public/${post._id}`}
      />
      <meta
        property="og:image:secure_url"
        content={`${
          post.image ? post.image.url : "https:merncamp.com/images/logo.jpg"
        }`}
      />
    </Head>
  );

  return (
    <>
      {head()}
      <ParallaxBG url="/images/img.png" />

      <div className="container">
        <div className="row pt-5">
          <div className="col-md-8 offset-2">
            <SinglePost post={post} />
          </div>
        </div>
      </div>
    </>
  );
};

// export const getServerSideProps = async (ctx) => {
//   const { data } = await axios.get(`/post/${ctx.params._id}`);
//   return { props: { post: data } };
// };

export default PublicPost;
