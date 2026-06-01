import { type FC } from 'react';

import { Typography } from '@/shared/ui';

import { ABOUT_AUTHOR, RS_SCHOOL_REACT_URL } from './-constants.ts';

import s from './about-page.module.css';

export const AboutPage: FC = () => {
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
            {ABOUT_AUTHOR.name}
          </Typography>
          <Typography variant="body2" className={s.sectionText}>
            {ABOUT_AUTHOR.bio}
          </Typography>
          <Typography
            as="a"
            variant="link1"
            href={ABOUT_AUTHOR.github}
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
};
