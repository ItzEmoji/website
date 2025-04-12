import Head from "next/head";

const CustomHead = ({ title }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content="ItzEmoji's Profolio." />
      <meta name="keywords" content="ItzEmoji, ItzEmoji, Cyril Dettling, Cyril Dettling, Cyril Dettling, ItzEmoji" />
      <meta property="og:title" content="Cyril Dettling's Portfolio" />
      <meta property="og:description" content="ItzEmoji's Profolio." />
      <meta property="og:image" content="https://imgur.com/2NqZL3h.png" />
      <meta property="og:url" content="https://itzemoji.com/" />
    </Head>
  );
};

export default CustomHead;

CustomHead.defaultProps = {
  title: "Cyril Dettling's Portfoio",
};
