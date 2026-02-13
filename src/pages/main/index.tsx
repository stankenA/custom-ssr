type MainPageProps = {
  date: number;
};

export const MainPage = ({ date }: MainPageProps) => {
  return (
    <main className='p-3 bg-amber-700 min-h-screen'>
      <h1 className='text-6xl text-red-500 my-3'>ISR page</h1>
      <p className='text-white'>Current date: {date}</p>
    </main>
  );
};
