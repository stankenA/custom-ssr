type MainPageProps = {
  date: number;
};

export const MainPage = ({ date }: MainPageProps) => {
  return (
    <main>
      <h1>ISR page</h1>
      <p>Current date: {date}</p>
    </main>
  );
};
