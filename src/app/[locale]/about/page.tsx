import type { FC } from 'react';

import { getTranslations } from 'next-intl/server';

import { ABOUT_AUTHOR, RS_SCHOOL_REACT_URL } from '@/constants/about';

export const dynamic = 'force-static';

const AboutPage: FC = async () => {
  const t = await getTranslations('About');

  return (
    <div className="flex w-full justify-center py-4">
      <article className="w-full max-w-[640px] rounded-xl border border-foreground/15 bg-surface-700 p-6">
        <h1 className="mb-6 text-[32px] font-bold text-foreground">{t('title')}</h1>

        <section className="mb-6" aria-labelledby="about-app-heading">
          <h2 id="about-app-heading" className="mb-2 text-[24px] font-bold text-foreground">
            {t('whatIsThis.title')}
          </h2>
          <p className="text-[14px] text-foreground/80">{t('whatIsThis.description')}</p>
        </section>

        <section className="mb-6" aria-labelledby="about-author-heading">
          <h2 id="about-author-heading" className="mb-2 text-[24px] font-bold text-foreground">
            {t('whoAreYou.title')}
          </h2>
          <p className="mb-2 text-[16px] font-semibold text-foreground">{ABOUT_AUTHOR.name}</p>
          <p className="mb-3 text-[14px] text-foreground/80">{ABOUT_AUTHOR.bio}</p>
          <a
            href={ABOUT_AUTHOR.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] text-brand-500 underline-offset-2 hover:underline"
          >
            {t('whoAreYou.githubProfile')}
          </a>
        </section>

        <section aria-labelledby="about-course-heading">
          <h2 id="about-course-heading" className="mb-2 text-[24px] font-bold text-foreground">
            {t('course.title')}
          </h2>
          <a
            href={RS_SCHOOL_REACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] text-brand-500 underline-offset-2 hover:underline"
          >
            {t('course.link')}
          </a>
        </section>
      </article>
    </div>
  );
};

export default AboutPage;
