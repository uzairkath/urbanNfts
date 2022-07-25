import "../styles/globals.css";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Facebook from "../public/assets/social-media-icons/facebook_32x32.png";
import Twitter from "../public/assets/social-media-icons/twitter_32x32.png";
import Email from "../public/assets/social-media-icons/email_32x32.png";
import Web3Modal from "web3modal";
import { providers } from "ethers";
function MyApp({ Component, pageProps }) {
  const [isConnected, setConnected] = useState(false);
  const [user, setUser] = useState("");
  const [isNavOpen, setIsNavOpen] = useState(false); // initiate isNavOpen state with false

  const web3modalRef = useRef();

  const getProviderOrSigner = async function (needSigner = false) {
    const provider = await web3modalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 4) {
      window.alert("change the network to rinkeby");
      throw new Error("Change the network to Rinkeby");
    }
    if (needSigner == true) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const connectWallet = async () => {
    try {
      let _user = await getProviderOrSigner(true);
      let address = await _user.getAddress();
      console.log(address);
      setUser(_user);
      setConnected(true);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (!isConnected) {
      web3modalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectionProvider: false,
      });
    }
  }, []);
  return (
    <div className="overlay">
      <nav>
        <section className="MOBILE-MENU flex lg:hidden">
          <div
            className="HAMBURGER-ICON absolute space-y-2 border-2 border-black rounded-sm p-1.5 bg-black"
            onClick={() => setIsNavOpen(prev => !prev)} // toggle isNavOpen state on click
          >
            <span className="block h-0.5 w-8 bg-white"></span>
            <span className="block h-0.5 w-8 bg-white"></span>
            <span className="block h-0.5 w-8 bg-white"></span>
          </div>
          <div className={isNavOpen ? "showMenuNav" : "hideMenuNav"}>
            <div
              className="CROSS-ICON absolute top-0 right-0 px-8 py-8"
              onClick={() => setIsNavOpen(false)} // change isNavOpen state to false to close the menu
            >
              <svg
                className="h-8 w-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <ul className="MENU-LINK-MOBILE-OPEN flex flex-col items-center justify-between min-h-[250px]">
              <li className="my-2 uppercase">
                <a href="https://www.facebook.com">
                  <Image src={Facebook} />
                </a>
              </li>
              <li className="my-2 uppercase">
                <a href="https://www.twitter.com">
                  <Image src={Twitter} />
                </a>
              </li>
              <li className="my-2 uppercase">
                <a href="https://www.gmail.com">
                  <Image src={Email} />
                </a>
              </li>
              <li className="my-2 uppercase">About</li>
              <li className="my-2 uppercase">Mint</li>
              <li className="my-2 uppercase">Team</li>
              {isConnected ? (
                <button className="border-solid border-2 text-sm bg-black font-bold mb-3 px-2 rounded-xl">
                  Connected
                </button>
              ) : (
                <button
                  className="border-solid border-2 text-sm bg-black font-bold px-2 mb-3 rounded-xl"
                  onClick={connectWallet}
                >
                  Connect Wallet
                </button>
              )}
            </ul>
          </div>
        </section>

        <div className="DESKTOP-MENU hidden lg:flex text-center mt-6 space-x-40 justify-center ">
          {/* right side of the nav */}
          <div>
            <a href="https://www.facebook.com">
              <Image src={Facebook} />
            </a>
          </div>
          <div>
            <a href="https://www.twitter.com">
              <Image src={Twitter} />
            </a>
          </div>
          <div>
            <a href="https://www.gmail.com">
              <Image src={Email} />
            </a>
          </div>
          <div className="font-bold mt-2 text-xl">About</div>
          <div className="font-bold mt-2 text-xl">Mint</div>
          <div className="font-bold mt-2 text-xl">Team</div>
          {isConnected ? (
            <button className="border-solid border-2 text-lg bg-black font-bold px-6 rounded-xl">
              Connected
            </button>
          ) : (
            <button
              className="border-solid border-2 text-lg bg-black font-bold px-6 rounded-xl"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </nav>
      <style>{`
      .hideMenuNav {
        display: none;
      }
      .showMenuNav {
        display: block;
        position: absolute;
        width: 100%;
        height: auto;
        top: 0;
        left: 0;
        background: black;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }
    `}</style>
      <Component
        {...pageProps}
        isConnected={isConnected}
        getProviderOrSigner={getProviderOrSigner}
        user={user}
      />
      <div className="moving-background"></div>
    </div>
  );
}

export default MyApp;
