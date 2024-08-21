import styles from './styles.module.css'
import FilterBanner from '../../components/FilterBanner'
import MovieCard from '../../components/MovieCard'
import Pagination from '../../components/Pagination'

import { useEffect, useState } from 'react'

export default function Filmes() {
    const limit = 6;
    const [offset, setOffset] = useState(0);
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const current = offset / limit + 1;

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:3000/films');
                const data = await response.json();
                setFilms(data);
            } catch (error) {
                console.error("Erro Api", error);
            }
            finally {
                setLoading(false);
            }
        }
        fetchMovies();
    }, []);

    const allMovies = films
    const currentMovies = allMovies.slice(offset, offset + limit);

    return (
        <main>
            <FilterBanner />
            <section className={styles.moviesList}>
                <h2>Filmes</h2>
                <div className={styles.movies}>
                    {loading ? (
                        <p>Carregando filmes...</p>
                    ) : (
                        currentMovies.map((film) => (
                            <MovieCard
                                key={film.id}
                                movieCoverImg={film.Url}
                                movieName={film.title}
                                movieDirector={film.diretor}
                                movieDescription={film.sinopse}
                                movieGenres={film.genero}
                            />
                        ))
                    )}
                </div>
            </section>
            <div className={styles.pagesButton}>
                <Pagination
                    limit={limit}
                    total={films.length}
                    offset={offset}
                    setOffset={setOffset}
                />
            </div>
        </main>
    )
}
