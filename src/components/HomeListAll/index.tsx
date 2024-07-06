import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";
import axiosFetch from "@/Utils/fetchBackend";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import MovieCardSmall from "../MovieCardSmall";
import { getContinueWatching } from "@/Utils/continueWatching";
import { useInView } from "react-intersection-observer";
import { MdChevronLeft, MdChevronRight, MdLink } from "react-icons/md";

const externalImageLoader = ({ src }: { src: string }) =>
  `${process.env.NEXT_PUBLIC_TMBD_IMAGE_URL}${src}`;

function shuffle(array: any) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

const dummyList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const HomeListAll = () => {
  const [latestMovie, setLatestMovie] = useState([]);
  const [latestTv, setLatestTv] = useState([]);
  const [latestKoreanDrama, setLatestKoreanDrama] = useState([]);
  const [popularKoreanDrama, setPopularKoreanDrama] = useState([]);
  const [latestAnime, setLatestAnime] = useState([]);
  const [popularAnime, setPopularAnime] = useState([]);
  const [popularMovie, setPopularMovie] = useState([]);
  const [popularTv, setPopularTv] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [continueWatching, setContinueWatching] = useState<any>();
  const [recommendations, setRecommendations] = useState([]);
  const [latestMovieRef, latestMovieInView] = useInView({
    triggerOnce: true,
  });
  const [latestTvRef, latestTvInView] = useInView({
    triggerOnce: true,
  });
  const [latestKoreanDramaRef, latestKoreanDramaInView] = useInView({
    triggerOnce: true,
  });
  const [popularKoreanDramaRef, popularKoreanDramaInView] = useInView({
    triggerOnce: true,
  });
  const [latestAnimeRef, latestAnimeInView] = useInView({
    triggerOnce: true,
  });
  const [popularAnimeRef, popularAnimeInView] = useInView({
    triggerOnce: true,
  });
  const [popularMovieRef, popularMovieInView] = useInView({
    triggerOnce: true,
  });
  const [popularTvRef, popularTvInView] = useInView({
    triggerOnce: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // const lM = await axiosFetch({ requestID: "trendingMovie" });
        // const lT = await axiosFetch({ requestID: "trendingTvDay" });
        // const pM = await axiosFetch({
        //   requestID: "popularMovie",
        //   sortBy: "vote_average.asc",
        // });
        // const pT = await axiosFetch({
        //   requestID: "trendingTv",
        //   sortBy: "vote_average.asc",
        // });
        // setLatestMovie(lM.results);
        // setLatestTv(lT.results);
        // setPopularMovie(pM.results);
        // setPopularTv(pT.results);
        // console.log({ pM });

        const continueWatching = await getContinueWatching();
        const asyncFunc = async () => {
          let arr: any[] = [];
          let i = 0;
          if (
            continueWatching &&
            (continueWatching?.tv?.length > 0 ||
              continueWatching?.movie?.length > 0)
          ) {
            for (const ele of continueWatching?.tv) {
              if (i < 5) {
                const res = await axiosFetch({
                  requestID: "tvRelated",
                  id: ele,
                });
                arr.push(res?.results);
                i++;
              }
            }
            for (const ele of continueWatching?.movie) {
              if (i < 10) {
                const res = await axiosFetch({
                  requestID: "movieRelated",
                  id: ele,
                });
                arr.push(res?.results);
                i++;
              }
            }
          }
          return arr;
        };
        asyncFunc().then((arr) => {
          const shuffledArray = shuffle(arr.flat(Infinity));
          const uniqueArray: any = [];
          const usedIds = new Set();

          shuffledArray.forEach((item: any) => {
            if (!usedIds.has(item?.id)) {
              uniqueArray.push(item);
              usedIds.add(item?.id);
            }
          });
          // console.log({ uniqueArray });
          const shuffledUniqueArray = shuffle(uniqueArray);
          // console.log({ shuffledArray });
          setRecommendations(shuffledUniqueArray);
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const lM = await axiosFetch({ requestID: "recentEpisodesAnime" });
        setLatestMovie(lM.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    if (latestMovieInView) fetchData();
  }, [latestMovieInView]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lT = await axiosFetch({ requestID: "trendingAnime" });
        setLatestTv(lT.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (latestTvInView) fetchData();
  }, [latestTvInView]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const month: any = new Date().getMonth().toString();
        const lT = await axiosFetch({
          requestID: "advancedSearch",
          sortBy: "POPULARITY_DESC",
          year: new Date().getFullYear().toString(),
          season:
            ((month == 0 || month == 1 || month == 2) && "WINTER") ||
            ((month == 3 || month == 4 || month == 5) && "SPRING") ||
            ((month == 6 || month == 7 || month == 8) && "SUMMER") ||
            ((month == 9 || month == 10 || month == 11) && "FALL"),
        });
        setLatestKoreanDrama(lT.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (latestKoreanDramaInView) fetchData();
  }, [latestKoreanDramaInView]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lT = await axiosFetch({
          requestID: "airingSchedule",
        });
        setPopularKoreanDrama(lT.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (popularKoreanDramaInView) fetchData();
  }, [popularKoreanDramaInView]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lT = await axiosFetch({
          requestID: "popularAnime",
          sortBy: "first_air_date.desc",
          genreKeywords: "210024,",
          // genreKeywords: "9840,293016,",
        });
        setLatestAnime(lT.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (latestAnimeInView) fetchData();
  }, [latestAnimeInView]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lT = await axiosFetch({
          requestID: "withKeywordsTv",
          sortBy: "vote_count.desc",
          genreKeywords: "210024,",
          // genreKeywords: "9840,",
          // genreKeywords: "9840,293016,",
        });
        setPopularAnime(lT.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (popularAnimeInView) fetchData();
  }, [popularAnimeInView]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pM = await axiosFetch({
          requestID: "popularMovie",
          sortBy: "vote_average.asc",
        });
        setPopularMovie(pM.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (popularMovieInView) fetchData();
  }, [popularMovieInView]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pT = await axiosFetch({
          requestID: "trendingTv",
          sortBy: "vote_average.asc",
        });
        setPopularTv(pT.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (popularTvInView) fetchData();
  }, [popularTvInView]);

  // useEffect(() => {
  //   const asyncFunc = async () => {
  //     let arr: any[] = [];
  //     let i = 0;
  //     if (
  //       continueWatching &&
  //       (continueWatching?.tv?.length > 0 ||
  //         continueWatching?.movie?.length > 0)
  //     ) {
  //       if (i < 5) {
  //         for (const ele of continueWatching?.tv) {
  //           const res = await axiosFetch({ requestID: "tvRelated", id: ele });
  //           arr.push(res?.results);
  //           i++;
  //         }
  //       }
  //       if (i < 10) {
  //         for (const ele of continueWatching?.movie) {
  //           const res = await axiosFetch({
  //             requestID: "movieRelated",
  //             id: ele,
  //           });
  //           arr.push(res?.results);
  //           i++;
  //         }
  //       }
  //     }
  //     return arr;
  //   };
  //   asyncFunc().then((arr) => {
  //     const shuffledArray = shuffle(arr.flat(Infinity));
  //     setRecommendations(shuffledArray);
  //   });
  // }, [continueWatching]);

  return (
    <div className={styles.HomeListAll}>
      <h1 ref={latestMovieRef}>
        Recently Updated
        <div>
          <MdChevronLeft
            onClick={() => {
              document
                .querySelectorAll(`.${styles.HomeListSection}`)
                [recommendations.length > 0 ? 1 : 0].scrollBy(-700, 0);
            }}
            data-tooltip-id="tooltip"
            data-tooltip-content="Swipe Left"
          />
          swipe
          <MdChevronRight
            onClick={() => {
              document
                .querySelectorAll(`.${styles.HomeListSection}`)
                [recommendations.length > 0 ? 1 : 0].scrollBy(700, 0);
            }}
            data-tooltip-id="tooltip"
            data-tooltip-content="Swipe Right"
          />
        </div>
      </h1>
      <div className={styles.HomeListSection}>
        {latestMovie?.map((ele) => {
          return <MovieCardSmall data={ele} media_type="movie" />;
        })}
        {latestMovie?.length === 0 &&
          dummyList.map((ele, i) => (
            <Skeleton className={styles.loading} key={i} />
          ))}
      </div>
      <h1 ref={latestTvRef}>
        Trending Anime
        <div>
          <MdChevronLeft
            onClick={() => {
              document
                .querySelectorAll(`.${styles.HomeListSection}`)
                [recommendations.length > 0 ? 2 : 1].scrollBy(-700, 0);
            }}
            data-tooltip-id="tooltip"
            data-tooltip-content="Swipe Left"
          />
          swipe
          <MdChevronRight
            onClick={() => {
              document
                .querySelectorAll(`.${styles.HomeListSection}`)
                [recommendations.length > 0 ? 2 : 1].scrollBy(700, 0);
            }}
            data-tooltip-id="tooltip"
            data-tooltip-content="Swipe Right"
          />
        </div>
      </h1>
      <div className={styles.HomeListSection}>
        {latestTv?.map((ele) => {
          return <MovieCardSmall data={ele} media_type="tv" />;
        })}
        {latestTv?.length === 0 &&
          dummyList.map((ele, i) => (
            <Skeleton className={styles.loading} key={i} />
          ))}
      </div>
      <h1 ref={latestKoreanDramaRef}>
        Top Anime
        <div>
          <MdChevronLeft
            onClick={() => {
              document
                .querySelectorAll(`.${styles.HomeListSection}`)
                [recommendations.length > 0 ? 3 : 2].scrollBy(-700, 0);
            }}
            data-tooltip-id="tooltip"
            data-tooltip-content="Swipe Left"
          />
          swipe
          <MdChevronRight
            onClick={() => {
              document
                .querySelectorAll(`.${styles.HomeListSection}`)
                [recommendations.length > 0 ? 3 : 2].scrollBy(700, 0);
            }}
            data-tooltip-id="tooltip"
            data-tooltip-content="Swipe Right"
          />
        </div>
      </h1>
      <div className={styles.HomeListSection}>
        {latestKoreanDrama?.map((ele) => {
          return <MovieCardSmall data={ele} media_type="tv" />;
        })}
        {latestKoreanDrama?.length === 0 &&
          dummyList.map((ele, i) => (
            <Skeleton className={styles.loading} key={i} />
          ))}
      </div>
      <h1 ref={popularKoreanDramaRef}>
        Airing This Week
        <div>
          <MdChevronLeft
            onClick={() => {
              document
                .querySelectorAll(`.${styles.HomeListSection}`)
                [recommendations.length > 0 ? 4 : 3].scrollBy(-700, 0);
            }}
            data-tooltip-id="tooltip"
            data-tooltip-content="Swipe Left"
          />
          swipe
          <MdChevronRight
            onClick={() => {
              document
                .querySelectorAll(`.${styles.HomeListSection}`)
                [recommendations.length > 0 ? 4 : 3].scrollBy(700, 0);
            }}
            data-tooltip-id="tooltip"
            data-tooltip-content="Swipe Right"
          />
        </div>
      </h1>
      <div className={styles.HomeListSection}>
        {popularKoreanDrama?.map((ele) => {
          return <MovieCardSmall data={ele} media_type="tv" />;
        })}
        {popularKoreanDrama?.length === 0 &&
          dummyList.map((ele, i) => (
            <Skeleton className={styles.loading} key={i} />
          ))}
      </div>
      <h1 ref={latestAnimeRef}>
        Popular Anime
        <div>
          <MdChevronLeft
            onClick={() => {
              document
                .querySelectorAll(`.${styles.HomeListSection}`)
                [recommendations.length > 0 ? 5 : 4].scrollBy(-700, 0);
            }}
            data-tooltip-id="tooltip"
            data-tooltip-content="Swipe Left"
          />
          swipe
          <MdChevronRight
            onClick={() => {
              document
                .querySelectorAll(`.${styles.HomeListSection}`)
                [recommendations.length > 0 ? 5 : 4].scrollBy(700, 0);
            }}
            data-tooltip-id="tooltip"
            data-tooltip-content="Swipe Right"
          />
        </div>
      </h1>
      <div className={styles.HomeListSection}>
        {latestAnime?.map((ele) => {
          return <MovieCardSmall data={ele} media_type="tv" />;
        })}
        {latestAnime?.length === 0 &&
          dummyList.map((ele, i) => (
            <Skeleton className={styles.loading} key={i} />
          ))}
      </div>
      {/* <h1 ref={popularAnimeRef}>
        Popular Anime
        <div>
          <MdChevronLeft
            onClick={() => {
              document
                .querySelectorAll(`.${styles.HomeListSection}`)
              [recommendations.length > 0 ? 6 : 5].scrollBy(-700, 0);
            }}
            data-tooltip-id="tooltip"
            data-tooltip-content="Swipe Left"
          />
          swipe
          <MdChevronRight
            onClick={() => {
              document
                .querySelectorAll(`.${styles.HomeListSection}`)
              [recommendations.length > 0 ? 6 : 5].scrollBy(700, 0);
            }}
            data-tooltip-id="tooltip"
            data-tooltip-content="Swipe Right"
          />
        </div>
      </h1>
      <div className={styles.HomeListSection}>
        {popularAnime?.map((ele) => {
          return <MovieCardSmall data={ele} media_type="tv" />;
        })}
        {popularAnime?.length === 0 &&
          dummyList.map((ele, i) => (
            <Skeleton className={styles.loading} key={i} />
          ))}
      </div> */}
    </div>
  );
};

export default HomeListAll;
