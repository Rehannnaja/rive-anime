import { useState, useEffect } from 'react'
import styles from "./style.module.scss";
import axiosFetch from '@/Utils/fetch';
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import MovieCardLarge from '../MovieCardLarge';
import { FaPlay, FaStar } from "react-icons/fa";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const MetaDetails = ({ id, type, data }: any) => {
  const [category, setCategory] = useState("overview"); // latest, trending, topRated
  const [categoryData, setCategoryData] = useState();
  const [imageLoading, setImageLoading] = useState(true);
  const [reviewDetail, setReviewDetail] = useState("");
  const [selectedSeason, setSelectedSeason] = useState(1);

  const genres: Array<string> = [];
  data?.genres?.map((ele: any) => {
    genres.push(ele.name);
  })
  const spoken_languages: Array<string> = [];
  data?.spoken_languages?.map((ele: any) => {
    spoken_languages.push(ele.name);
  })
  const production_countries: Array<string> = [];
  data?.production_countries?.map((ele: any) => {
    production_countries.push(ele.name);
  })
  const production_companies: Array<string> = [];
  data?.production_companies?.map((ele: any) => {
    production_companies.push(ele.name);
  })
  const release_date = new Date(data?.release_date);
  const birthday = new Date(data?.birthday);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    const fetchData = async () => {
      const CapitalCategoryType = capitalizeFirstLetter(category);
      if (category !== "overview") {
        try {
          let res;
          if (category === "episodes") {
            res = await axiosFetch({ requestID: `${type}${CapitalCategoryType}`, id: id, season: selectedSeason });
          } else {
            res = await axiosFetch({ requestID: `${type}${CapitalCategoryType}`, id: id });
          }
          setCategoryData(res);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [category, selectedSeason]);

  return (
    <div className={styles.MetaDetailPage}>
      <div className={styles.MetaDetails}>
        <div className={styles.category}>
          {type === "tv" ? <p className={`${category === "episodes" ? styles.active : styles.inactive}`} onClick={() => setCategory("episodes")}>Episodes</p> : null}
          <p className={`${category === "overview" ? styles.active : styles.inactive}`} onClick={() => setCategory("overview")}>Overview</p>
          {
            type !== "person" ?
              <>
                <p className={`${category === "casts" ? styles.active : styles.inactive}`} onClick={() => setCategory("casts")}>Casts</p>
                <p className={`${category === "reviews" ? styles.active : styles.inactive}`} onClick={() => setCategory("reviews")}>Reviews</p>
                <p className={`${category === "related" ? styles.active : styles.inactive}`} onClick={() => setCategory("related")}>Related</p>
              </>
              :
              <>
                <p className={`${category === "movie" ? styles.active : styles.inactive}`} onClick={() => setCategory("movie")}>Movies</p>
                <p className={`${category === "tv" ? styles.active : styles.inactive}`} onClick={() => setCategory("tv")}>TV Shows</p>

              </>
          }
        </div>

        {type === "tv" && category === "episodes" ?
          <div className={styles.EpisodeList}>
            <select name="season" id="season" value={selectedSeason} onChange={(e: any) => setSelectedSeason(e.target.value)}>
              {data?.seasons?.map((ele: any, i: number) => {
                console.log({ i }); return (
                  <option key={ele.id} value={ele?.season_number} selected={i == 0}>{ele.name} {` (${ele.episode_count})`}</option>
                )
              })}
            </select>
            {
              category === "episodes" && categoryData?.episodes?.map((ele) => {
                return (
                  <div className={`${styles.episode} ${reviewDetail === ele?.id ? styles.ReviewDetail : null}`} onClick={() => setReviewDetail((prev) => prev !== ele?.id ? ele?.id : "")}>
                    <Link href={`/watch?type=tv&id=${ele?.id}`} className={styles.CardSmall}>
                      <div className={`${styles.img} ${imageLoading ? "skeleton" : null}`}>
                        <AnimatePresence mode="sync">
                          <motion.img
                            key={ele?.id}
                            src={`${(ele?.still_path !== null && ele?.still_path !== undefined) ? process.env.NEXT_PUBLIC_TMBD_IMAGE_URL + ele?.still_path : "/images/logo.svg"}`}
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: imageLoading ? 0 : 1
                            }}
                            height="100%"
                            width="100%"
                            exit="exit"
                            className={`${styles.img} ${imageLoading ? "skeleton" : null}`}
                            onLoad={() => { setImageLoading(false); }}
                            loading="lazy"
                          // style={!imageLoading ? { opacity: 1 } : { opacity: 0 }}
                          />
                        </AnimatePresence>
                      </div>
                    </Link>
                    <div className={styles.details}>
                      <h4>{`EP ${ele.episode_number}`}{`${ele?.name ? " : " + ele?.name : null}`}</h4>
                      <p>{`${ele?.vote_average ? "• " + ele?.vote_average.toFixed(1) : null}`}</p>
                      <Link className={`${styles.links} btn`} href={`/watch?type=tv&id=${ele?.id}`}>watch <FaPlay /></Link>
                      <p>{ele?.overview}</p>
                    </div>
                  </div>
                )
              })
            }
          </div>
          : null}

        <div className={styles.categoryDetails}>
          {
            category === "overview" && type !== "person" && (
              <>
                <p>{data?.overview}</p>
                {release_date.getDate() ? <><h3>Release</h3>
                  <p>{`${release_date.getDate()} ${monthNames[release_date.getMonth()]} ${release_date.getFullYear()}`}</p></> : null}
                {data?.runtime ? <><h3>Runtime</h3>
                  <p>{`${Math.floor((data?.runtime) / 60)}hr ${((data?.runtime) % 60).toFixed(0)}min`}</p></> : null}
                {genres?.length > 0 ? <><h3>Genre</h3>
                  <p>{genres?.join(", ")}</p></> : null}
                {spoken_languages?.length > 0 ? <><h3>Spoken Languages</h3>
                  <p>{spoken_languages?.join(", ")}</p></> : null}
                {production_countries?.length > 0 ? <><h3>Production Countries</h3>
                  <p>{production_countries?.join(", ")}</p></> : null}
                {production_companies?.length > 0 ? <><h3>Production Companies</h3>
                  <p>{production_companies?.join(", ")}</p></> : null}
              </>
            )
          }
          {
            category === "overview" && type === "person" && (
              <>
                <p>{data?.biography}</p>
                {birthday.getDate() ? <><h3>Birthday</h3>
                  <p>{`${birthday.getDate()} ${monthNames[birthday.getMonth()]} ${birthday.getFullYear()}`}</p></> : null}
                {data?.place_of_birth ? <><h3>Place of Birth</h3>
                  <p>{data?.place_of_birth}</p></> : null}
                {data?.known_for_department ? <><h3>Department</h3>
                  <p>{data?.known_for_department}</p></> : null}
              </>
            )
          }
          <div className={styles.casts}>
            {
              category === "casts" && categoryData?.cast?.map((ele: any) => (
                <div className={styles.cast}>
                  <Link href={`/person?id=${ele?.id}`} className={styles.CardSmall}>
                    <div className={`${styles.img} ${imageLoading ? "skeleton" : null}`}>
                      <AnimatePresence mode="sync">
                        <motion.img
                          key={ele?.id}
                          src={`${(ele?.profile_path !== null && ele?.profile_path !== undefined) ? process.env.NEXT_PUBLIC_TMBD_IMAGE_URL + ele?.profile_path : "/images/logo.svg"}`}
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: imageLoading ? 0 : 1
                          }}
                          height="100%"
                          width="100%"
                          exit="exit"
                          className={`${styles.img} ${imageLoading ? "skeleton" : null}`}
                          onLoad={() => { setImageLoading(false); }}
                          loading="lazy"
                        // style={!imageLoading ? { opacity: 1 } : { opacity: 0 }}
                        />
                      </AnimatePresence>
                    </div>
                  </Link>
                  <div className={styles.castName}>
                    <h4>{ele?.name}</h4>
                    <p>{ele?.character}</p>
                  </div>
                </div>
              ))
            }
          </div>

          <div className={styles.MovieList}>
            {
              category === "related" && categoryData?.results?.map((ele) => {
                return (
                  <MovieCardLarge data={ele} media_type={type} />
                )
              })
            }
          </div>
          <div className={styles.ReviewList}>
            {
              category === "reviews" && categoryData?.results?.map((ele) => {
                const review_date = new Date(ele?.created_at);
                return (
                  <div className={`${styles.Review} ${reviewDetail === ele?.id ? styles.ReviewDetail : null}`} onClick={() => setReviewDetail((prev) => prev !== ele?.id ? ele?.id : "")}>
                    <h4>{ele?.author}</h4>
                    <p>{`${review_date.getDate()} ${monthNames[review_date.getMonth()]} ${review_date.getFullYear()}`}</p>
                    <p className={styles.rating}><FaStar /> {ele?.author_details?.rating}</p>
                    <p>{ele?.content}</p>
                  </div>
                )
              })
            }
            {
              (category === "reviews" && categoryData?.results?.length === 0) ? <div className={styles.Review}><p>No Reviews Found</p></div> : null
            }
          </div>
          <div className={styles.MovieList}>
            {
              category === "movie" && categoryData?.cast?.map((ele) => {
                return (
                  <MovieCardLarge data={ele} media_type="movie" />
                )
              })
            }
          </div>
          <div className={styles.MovieList}>
            {
              category === "tv" && categoryData?.cast?.map((ele) => {
                return (
                  <MovieCardLarge data={ele} media_type="tv" />
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default MetaDetails