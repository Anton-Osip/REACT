import type { FC } from 'react';

import { ABOUT_AUTHOR, RS_SCHOOL_REACT_URL } from '@/constants/about';

export const dynamic = 'force-static';

const AboutPage: FC = () => {
  return (
    <div className="flex w-full justify-center py-4">
      <article className="w-full max-w-[640px] rounded-xl border border-foreground/15 bg-surface-700 p-6">
        <h1 className="mb-6 text-[32px] font-bold text-foreground">About</h1>

        <section className="mb-6" aria-labelledby="about-app-heading">
          <h2 id="about-app-heading" className="mb-2 text-[24px] font-bold text-foreground">
            What is this?
          </h2>
          <p className="text-[14px] text-foreground/80">
            A React client for the Rick and Morty API. Explore characters from the show, search by name, and view
            details — powered by the REST API at rickandmortyapi.com.
          </p>
        </section>

        <section className="mb-6" aria-labelledby="about-author-heading">
          <h2 id="about-author-heading" className="mb-2 text-[24px] font-bold text-foreground">
            Who are you?
          </h2>
          <p className="mb-2 text-[16px] font-semibold text-foreground">{ABOUT_AUTHOR.name}</p>
          <p className="mb-3 text-[14px] text-foreground/80">{ABOUT_AUTHOR.bio}</p>
          <a
            href={ABOUT_AUTHOR.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] text-brand-500 underline-offset-2 hover:underline"
          >
            GitHub profile
          </a>
        </section>

        <section aria-labelledby="about-course-heading">
          <h2 id="about-course-heading" className="mb-2 text-[24px] font-bold text-foreground">
            Course
          </h2>
          <a
            href={RS_SCHOOL_REACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] text-brand-500 underline-offset-2 hover:underline"
          >
            RS School React course
          </a>
        </section>
      </article>
    </div>
  );
};

export default AboutPage;
