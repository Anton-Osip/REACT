import { Typography } from '@/components';

import s from './about-page.module.css';

export const RS_SCHOOL_REACT_URL = 'https://rs.school/courses/reactjs';

export const author = {
  name: 'Антон',
  github: 'https://github.com/Anton-Osip',
  bio: 'This app lets you browse Rick and Morty characters from the public API — search by name, paginate results, and open character details. It was built as a learning project for the RS School React course.',
} as const;

export function AboutPage() {
  return (
    <div className={s.about}>
      <article className={s.aboutContent}>
        <Typography variant="h2" as="h1" className={s.title}>
          About
        </Typography>

        <section className={s.section} aria-labelledby="about-app-heading">
          <Typography
            id="about-app-heading"
            variant="h3"
            as="h2"
            className={s.sectionTitle}
          >
            What is this?
          </Typography>
          <Typography variant="body2" className={s.sectionText}>
            A React client for the Rick and Morty API. Explore characters from
            the show, search by name, and view details — powered by the REST API
            at rickandmortyapi.com.
          </Typography>
        </section>

        <section className={s.section} aria-labelledby="about-author-heading">
          <Typography
            id="about-author-heading"
            variant="h3"
            as="h2"
            className={s.sectionTitle}
          >
            Who are you?
          </Typography>
          <Typography variant="subtitle1" className={s.authorName}>
            {author.name}
          </Typography>
          <Typography variant="body2" className={s.sectionText}>
            {author.bio}
          </Typography>
          <Typography
            as="a"
            variant="link1"
            href={author.github}
            target="_blank"
            rel="noopener noreferrer"
            className={s.authorLink}
          >
            GitHub profile
          </Typography>
        </section>

        <section className={s.section} aria-labelledby="about-course-heading">
          <Typography
            id="about-course-heading"
            variant="h3"
            as="h2"
            className={s.sectionTitle}
          >
            Course
          </Typography>
          <Typography
            as="a"
            variant="link1"
            href={RS_SCHOOL_REACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={s.courseLink}
          >
            RS School React course
          </Typography>
        </section>
      </article>
    </div>
  );
}
