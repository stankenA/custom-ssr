import { GetStaticProps } from "@/shared/types";

type StaticPageProps = {
  generatedAt: string;
};

export const getStaticProps: GetStaticProps<StaticPageProps> = async () => {
  return { props: { generatedAt: new Date().toISOString() } };
};

const StaticPage = ({ generatedAt }: StaticPageProps) => {
  return (
    <main className='min-h-screen bg-indigo-600'>
      <h1 className='text-amber-600 text-5xl'>Static Page</h1>
      <p>This page is fully static.</p>
      <p>Generated at: {generatedAt} — stays the same on every refresh</p>
    </main>
  );
};

export default StaticPage;
