import ParallaxBG from "../components/cards/ParallaxBG";
import axios from "axios";
import SinglePost from "../components/cards/SinglePost";
import Link from "next/link";
import Head from "next/head";
import { useEffect, useState } from "react";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("/posts").then((response) => setPosts(response.data));
  }, []);

  const head = () => (
    <Head>
      <title>MERNCAMP - A social network by devs for devs</title>
      <meta name="description" content="A social network for devs by devs" />
      <meta
        property="og:description"
        content="A social network for devs by devs"
      />
      <meta property="og:type" content="webapp" />
      <meta property="og:site_name" content="MERNCAMP" />
      <meta property="og:url" content="https://merncamp.com" />
      <meta
        property="og:image:secure_url"
        content="https://merncamp.com/images/img.png"
      />
    </Head>
  );

  return (
    <>
      {head()}
      <ParallaxBG url="/images/img.png" />

      <div className="container">
        <div className="row pt-5">
          {posts.map((post, index) => (
            <div className="col-md-4" key={index}>
              <Link href={`/post/public/${post._id}`}>
                <a>
                  <SinglePost post={post} />
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// export const getServerSideProps = async () => {
//   const { data } = await axios.get("/posts");
//   console.log(data);
//   return { props: { data } };
// };

export default Home;
