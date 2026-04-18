import { useState } from "react";
import { GetServerSideProps } from "@/shared/types";

type MainPageProps = {
  date: number;
};

export const getServerSideProps: GetServerSideProps<
  MainPageProps
> = async () => {
  return { props: { date: Date.now() } };
};

const MainPage = ({ date }: MainPageProps) => {
  const [count, setCount] = useState(0);
  return (
    <main className='p-3 bg-amber-700 min-h-screen'>
      <h1 className='text-6xl text-red-500 my-3'>ISR page</h1>
      <p className='text-white'>Current date: {date}</p>
      <p>Counter: {count}</p>
      <button type='button' onClick={() => setCount(count + 1)}>
        Increase count
      </button>
    </main>
  );
};

export default MainPage;
