import React, { useEffect, useState } from "react";
import Rive, { Alignment, Fit, Layout } from "@rive-app/react-canvas";
import Button from "./common/Button";
import Cookies from "js-cookie";
import { getAccountRaffleInfo } from "../api";
import { useNavigate } from "react-router-dom";
import { readContracts, useAccount } from "wagmi";


import { writeContract } from '@wagmi/core'
import abi from "../../contracts/abi";
import { toast } from "react-toastify";



const tele = window.Telegram?.WebApp;

const rarityLevels = {
  1: [
    { name: "Common", percentage: "50%", img: "/rarity/common.png" },
    { name: "Uncommon", percentage: "49%", img: "/rarity/uncommon.png" },
    { name: "Rare", percentage: "1%", img: "/rarity/rare.png" },
  ],
  2: [
    { name: "Uncommon", percentage: "50%", img: "/rarity/uncommon.png" },
    { name: "Rare", percentage: "49%", img: "/rarity/rare.png" },
    { name: "Epic", percentage: "1%", img: "/rarity/epic.png" },
  ],
  3: [
    { name: "Rare", percentage: "50%", img: "/rarity/rare.png" },
    { name: "Epic", percentage: "49%", img: "/rarity/epic.png" },
    { name: "Legendary", percentage: "1%", img: "/rarity/legendary.png" },
  ],
  4: [
    { name: "Epic", percentage: "50%", img: "/rarity/epic.png" },
    { name: "Legendary", percentage: "49%", img: "/rarity/legendary.png" },
    { name: "Mystic", percentage: "1%", img: "/rarity/mystic.png" },
  ],
  5: [
    { name: "Legendary", percentage: "50%", img: "/rarity/legendary.png" },
    { name: "Mystic", percentage: "49%", img: "/rarity/mystic.png" },
    { name: "Megasaur", percentage: "1%", img: "/rarity/megasur.png" },
  ],
};

const Egg = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [eggs, setEggs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const rarityMap = {
    common: 1,
    uncommon: 2,
    rare: 3,
    epic: 4,
    legendary: 5,
    mystic: 6,
    megasaur: 7,
  };

  const determineRarity = (rarityName) => {
    return rarityMap[rarityName.toLowerCase()] || null;
  };

  const [eggTheme, setEggTheme] = useState({
    lvl: 1,
    limit: 1000000,
  });

  const determineEggTheme = (noOfTaps) => {
    if (noOfTaps >= 16000000) {
      setEggTheme({
        lvl: 6,
        limit: 0,
      });
    } else if (noOfTaps >= 8000000) {
      setEggTheme({
        lvl: 5,
        limit: 16000000,
      });
    } else if (noOfTaps >= 4000000) {
      setEggTheme({
        lvl: 4,
        limit: 8000000,
      });
    } else if (noOfTaps >= 2000000) {
      setEggTheme({
        lvl: 3,
        limit: 4000000,
      });
    } else if (noOfTaps >= 1000000) {
      setEggTheme({
        lvl: 2,
        limit: 2000000,
      });
    } else {
      setEggTheme({
        lvl: 1,
        limit: 1000000,
      });
    }
  };

  const fetchClaimedNFTS = async () => {
    setIsLoading(true);
    const accessToken = Cookies.get("Authorization");

    try {
      const response = await getAccountRaffleInfo(accessToken);
      setEggs(response.raffleInfo.claimedEggs);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClaimedNFTS();
  }, []);

  const currentRarities = rarityLevels[eggs[currentIndex]?.level || 1];

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (tele) {
          await tele.ready();
          tele.BackButton.show();
          tele.BackButton.onClick(() => navigate("/home"));
          tele.setHeaderColor("#1a241a");
        } else {
          console.error("Telegram WebApp API not available");
        }
      } catch (error) {
        console.error("Error fetching user data from Telegram:", error);
      }
    };
    getUserData();
  }, []);

  const handleLeftClick = () => {
    if (currentIndex !== 0) {
      tele.HapticFeedback.notificationOccurred("success");
      setCurrentIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    }
  };

  const handleRightClick = () => {
    if (currentIndex !== eggs.length - 1 && eggs.length != 0) {
      tele.HapticFeedback.notificationOccurred("success");
      setCurrentIndex((prevIndex) =>
        prevIndex < eggs.length - 1 ? prevIndex + 1 : prevIndex
      );
    }
  };

  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
  }, [data]);


  const onClaim = async () => {
    const result = await writeContract({
      abi,
      address: '0x9096843c7e8a636065063233c6dCf7D23518f81B',
      functionName: 'mint',
      // args: [
      //   '0'
      // ],
    })
    const transactionReceipt = getTransactionReceipt({
      hash: result.hash,
    })
    console.log(transactionReceipt)

    toast.success("NFT Minted successfully!")
    navigate("/mynft");

  }

  return (
    <div
      style={{
        background:
          "url(https://cdn.mappasaurus.com/nest.jpg) no-repeat center center",
        backgroundSize: "cover",
        height: "100vh",
        width: "100vw",
      }}
      className="relative w-screen h-screen"
    >
      {isLoading ? (
        <div className={`h-screen w-screen flex justify-center items-center`}>
          <img src="/images/loading.gif" className="-mt-20" alt="loader" />
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center h-screen mx-2 select-none">
          <div className="text-[#FFF7DC] font-montaga text-[16px] my-[10px]">
            EGGS
          </div>

          <div className="flex items-center justify-center w-screen h-screen px-4">
            <div>
              <div className="flex items-center justify-between w-screen -mt-44">
                <img
                  src="/common/chevron-left.svg"
                  onClick={handleLeftClick}
                  className={`cursor-pointer ml-4 ${currentIndex === 0 ? "opacity-50" : ""
                    }`}
                  alt="Left Arrow"
                  disabled={currentIndex === 0}
                />
                {eggs.length === 0 ? (
                  <img
                    src="https://cdn.mappasaurus.com/eggs-png%2Fzero-egg.png"
                    className="w-[211px] h-[268px]"
                    alt="Zero Egg"
                  />
                ) : (
                  <img
                    src={`https://cdn.mappasaurus.com/eggs-png%2Flevel${eggs[currentIndex].level}.png`}
                    className="w-[211px] h-[268px]"
                    alt={`Egg ${currentIndex}`}
                  />
                )}
                <img
                  src="/common/right.svg"
                  onClick={handleRightClick}
                  className={`cursor-pointer mr-4 ${currentIndex === eggs.length - 1 || eggs.length == 0
                    ? "opacity-50"
                    : ""
                    }`}
                  alt="Right Arrow"
                  disabled={currentIndex === eggs.length - 1}
                />
              </div>
              <div className="flex gap-1 p-3 mx-auto mt-4 mb-4 text-white rounded-full bg-nestbg w-fit">
                {eggs.length == 0 ? 0 : currentIndex + 1 + " / " + eggs.length}
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-[20px]">
              {eggs.length > 0 && (
                <div className="flex gap-x-[25px] justify-center items-center">
                  {currentRarities.map((rarity) => (
                    <div
                      key={rarity.name}
                      className={`p-[8px] border rounded-[10px] borderx${determineRarity(
                        rarity.name
                      )} bg-[#28332B]`}
                    >
                      <div className="flex items-center justify-center">
                        <img
                          src={rarity.img}
                          className="w-[28px] h-[27.3px] mr-[8px]"
                          alt={rarity.name}
                        />
                        <p className="text-[#FFF7DC] font-montaga text-[16px]">
                          {rarity.percentage}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between mx-[10px] my-[10px]">
                <div className="my-auto">
                  <img
                    onClick={() => {
                      // tele.HapticFeedback.notificationOccurred("success");
                      // navigate("/comingsoon");
                      onClaim();
                    }}
                    src="/common/questionmark.svg"
                    alt="Question Mark"
                  />
                </div>

                <div className="text-[22px] my-auto z-30 font-GAMERIA text-[#FFF38B] font-normal uppercase text-stroke2">
                  {eggs.length === 0 ? "ZERO EGGS" : "Reward Probability"}
                </div>

                <div
                  onClick={() => {
                    tele.HapticFeedback.notificationOccurred("success");
                    navigate("/nest");
                  }}
                  className="my-auto"
                >
                  <img src="/icons/cards-egg.svg" alt="Cards Egg" />
                </div>
              </div>

              <div>
                {
                  //     eggs.length === 0 ? (
                  //   <Button
                  //     message="keep tapping!"
                  //     action={() => {
                  //       navigate("/home");
                  //     }}
                  //   />
                  // ) : (
                  <button
                    onClick={() => {
                      // tele.HapticFeedback.notificationOccurred("success");
                      // navigate("/comingsoon");
                      onClaim()
                    }}
                    className={`level${eggs[currentIndex].level} min-h-[70px] w-[100%] p-[0.5rem] z-50 mb-1 rounded-[1.25rem] borderx${eggs[currentIndex].level}`}
                  >
                    <span
                      className="font-GAMERIA text-center text-[1.8rem] font-bold uppercase text-stroke text-shadow-2"
                      style={{ letterSpacing: "1px" }}
                    >
                      Hatch
                    </span>
                  </button>
                  // )
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Egg;
