import { Contract, utils } from "ethers";
import { useEffect, useState } from "react";
import { address, abi } from "../constants";
export default function Home(props) {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [mintAmount, setMintAmount] = useState(0);

  const increment = () => {
    if (mintAmount >= 3) return;
    setMintAmount(mintAmount + 1);
  };
  const decrement = () => {
    if (mintAmount <= 1) return;
    setMintAmount(mintAmount - 1);
  };
  const mint = async () => {
    try {
      const signer = await props.getProviderOrSigner(true);
      console.log(signer);
      const contract = new Contract(address, abi, signer);
      const eth = mintAmount * 0.01;
      console.log(eth);
      const tx = await contract.mint(mintAmount, {
        value: utils.parseEther(eth.toString()),
      });
      setLoading(true);
      await tx.wait();
      checkBal();
      setLoading(false);
      window.alert("Successfully Minted UrbanNFT");
    } catch (error) {
      console.error(error);
    }
  };
  const checkBal = async () => {
    const contract = new Contract(address, abi, props.user);
    const signer = await props.user.getAddress();
    const bal = await contract.balanceOf(signer);
    setBalance(bal.toString());
  };
  useEffect(() => {
    if (props.user !== "") {
      checkBal();
    }
  }, [props.user]);

  return (
    <div className="text-center relative top-48 w-2/5 m-auto">
      <h1 className="font-bold text-2xl md:text-4xl lg:text-7xl">UrbanPunks</h1>
      <p>
        It's 2050, Can UrbanPunks NFT save humans from destructive rampant NFT
        speculation? Mint UrbanPunks to find out.<br></br>
        You must be connected to Mint.
      </p>
      <div className="relative top-10">
        <div>
          <button
            className="border-solid border-white border-2 px-1 font-bold bg-black rounded-full mr-2"
            onClick={decrement}
          >
            -
          </button>
          <input
            className="text-black text-center w-12"
            type="number"
            value={mintAmount}
            readOnly
          />
          <button
            className="border-solid border-white border-2 px-1 font-bold bg-black rounded-full ml-2"
            onClick={increment}
          >
            +
          </button>
        </div>
        <button
          onClick={mint}
          className=" border-white border-2 px-3 font-bold rounded-sm mt-2 font text-xl"
        >
          Mint
        </button>
        <h1 className="mt-10 font-bold capitalize">
          You are holding {balance} urbanPunks right now
        </h1>
      </div>
    </div>
  );
}
