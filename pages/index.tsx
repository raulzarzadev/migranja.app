import type { NextPage } from "next";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/layout";
import { selectAuthState, setAuthState } from "../slices/authSlice";
import { decrement, increment, selectCountState } from "../slices/couterSlice";

const Home: NextPage = () => {
  const dispatch = useDispatch();
  const authState = useSelector(selectAuthState);
  const counterValue = useSelector(selectCountState);

  return (
    <div>
      <Head>
        <title>RZ nextjs-temaplate </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/icons.icon.ico" />
      </Head>
      <Layout>
        <div>Hola, bienvenido al tempalte de nextjs pwa tailwind</div>
        <div>
          <h1>Auth state</h1>
          <div className="flex w-full justify-center flex-col items-center">
            <div>{authState ? "Logged in" : "Not Logged In"}</div>
            <button
              className="bg-slate-500 p-2 rounded-lg  border-2 hover:border-transparent"
              onClick={() =>
                authState
                  ? dispatch(setAuthState(false))
                  : dispatch(setAuthState(true))
              }
            >
              {authState ? "Logout" : "LogIn"}
            </button>
          </div>
        </div>
        <div>
          <h1>Couter state</h1>
          <div className="flex w-full justify-center flex-col items-center">
            <div>The counter value is : {counterValue}</div>
            <button
              className=" w-full h-10 bg-green-400/50"
              onClick={() => dispatch(increment())}
            >
              Increment
            </button>
            <button
              className=" w-full h-10 bg-red-400/50"
              onClick={() => dispatch(decrement())}
            >
              Decrement
            </button>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
