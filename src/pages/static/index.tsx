export const pageConfig = { route: "/static" };

const StaticPage = () => {
  return (
    <main className='min-h-screen bg-indigo-600'>
      <h1 className='text-amber-600 text-5xl'>Static Page</h1>
      <p>This page is fully static.</p>
    </main>
  );
};

export default StaticPage;
