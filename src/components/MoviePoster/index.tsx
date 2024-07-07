import { useState } from "react";
import styles from "./style.module.scss";
import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import Skeleton from "react-loading-skeleton";

// react-lazy-load-image-component
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
const MoviePoster = ({ data, media_type }: any) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imagePlaceholder, setImagePlaceholder] = useState(false);
  // console.log(data);

  return (
    <Link
      href={`/detail?type=${data?.type?.toLowerCase() === "movie" ? "movie" : "tv"}&id=${data?.id}`}
      className={styles.MovieCardSmall}
      aria-label={data?.name || "poster"}
    >
      <div
        className={`${styles.img} ${data?.image !== null && data?.image !== undefined ? "skeleton" : null}`}
      >
        {/* if rllic package is not available, then start using this code again, and comment/delete the rllic code */}
        {/* <AnimatePresence mode="sync">
          <motion.img
            key={data?.id}
            alt={data?.id || "sm"}
            src={`${imagePlaceholder ? "/images/logo.svg" : data?.image !== null && data?.image !== undefined ? process.env.NEXT_PUBLIC_TMBD_IMAGE_URL + data?.image : "/images/logo.svg"}`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: imageLoading ? 0 : 1,
            }}
            height="100%"
            width="100%"
            exit="exit"
            // className={`${styles.img} ${imageLoading ? "skeleton" : null}`}
            onLoad={() => {
              setImageLoading(false);
            }}
            loading="lazy"
            onError={(e) => {
              // console.log({ e });
              setImagePlaceholder(true);
            }}
            // style={!imageLoading ? { opacity: 1 } : { opacity: 0 }}
          />
        </AnimatePresence> */}

        {/* react-lazy-load-image-component */}
        <LazyLoadImage
          key={data?.id}
          alt={data?.id || "sm"}
          src={`${data?.image?.replace("/large/", "/medium/")}`}
          height="100%"
          width="100%"
          useIntersectionObserver={true}
          effect="opacity"
          // className={`${styles.img} ${imageLoading ? "skeleton" : null}`}
          onLoad={() => {
            setImageLoading(false);
          }}
          loading="lazy"
          onError={(e) => {
            // console.log({ e });
            setImagePlaceholder(true);
          }}
          // style={!imageLoading ? { opacity: 1 } : { opacity: 0 }}
        />
      </div>
    </Link>
  );
};

export default MoviePoster;
