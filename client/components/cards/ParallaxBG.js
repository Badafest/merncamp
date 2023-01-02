const ParallaxBG = ({ url, children = "MERNCAMP" }) => {
  return (
    <div className="container-fluid">
      <h1
        className="display-3 font-weight-bold py-5 text-center"
        style={{
          backgroundImage: "url('" + url + "')",
          backgroundAttachment: "fixed",
          padding: "100px 0 75px 0",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          display: "block",
        }}
      >
        {children}
      </h1>
    </div>
  );
};

export default ParallaxBG;
