import React from 'react';
import { getGuideContent, getGuides } from '@/lib/guides';
import Link from 'next/link';
import Navbar from '@/app/_components/navbar';
import ThemeSelect from '@/app/_components/themeselect';
import Markdown from 'markdown-to-jsx'


export default function RenderGuide({ guide, content }: { guide: string, content: string }) {
  if (!content) return ( <div>
    <span className="loading loading-infinity loading-lg"></span> <div>Loading...</div></div>
  );

  if (content == "NULLL") return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Sorry, we can&apos;t seem to find this guide.</h1>
      <Link href="/guides" className="btn btn-primary mb-4">
        Back to Guides
      </Link>
    </div>
  );
  console.log(content)

  console.log(guide)
  const guideTitle = guide.replace(/_/g, ' ');

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <Link href="/guides" className='btn btn-primary mb-4'>
          Back to Guides
        </Link>
        <h1 className="text-2xl font-bold mb-4 text-center">{guideTitle}</h1>
        <Markdown options={{ wrapper: 'article' }}>{content}</Markdown>
      </div>
      <ThemeSelect />
    </div>
  );
};

export async function getStaticPaths() {
  const guides = await getGuides();
  const paths = guides.map((guide: { path: string }) => ({
    params: { guide: guide.path.split('/').pop()?.replace('.md', '') },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { guide: string } }) {
  const content = await getGuideContent(`${params.guide}.md`);
  return { props: { guide: params.guide, content } };
}