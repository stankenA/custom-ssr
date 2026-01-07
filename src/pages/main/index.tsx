type MainPageProps = {
  date: number;
};

export const MainPage = ({ date }: MainPageProps) => {
  return (
    <div>
      <h1>Dynamic page</h1>
      <p>Current date: {date}</p>
    </div>
  );
};
