import { useEffect, useState } from "react";
import Button from "./Button";
import { claimBooster } from "../../api";
import Cookies from "js-cookie";
import Mesg from "./ToastMsg";
import { toast } from "react-toastify";

const tele = window.Telegram?.WebApp;
const BoostModal = ({
  boosterType,
  energyBoosterLevel,
  turboBoosterLevel,
  handleCloseModal,
  gameData,
}) => {
  const [boosterValues, setBoosterValues] = useState(null);
  const [error, setError] = useState(null);
  const [modalStyle, setModalStyle] = useState("opacity-0 translate-y-4");
  const [price, setPrice] = useState(0);

  const RechargeBootser = [
    {
      lvl: 1,
      message: "Speed up your energy regeneration up to 1.5X Unlock Level 1",
      coins: 10000,
    },
    {
      lvl: 2,
      message: "Speed up your energy regeneration up to 2X Unlock Level 2",
      coins: 20000,
    },
    {
      lvl: 3,
      message: "Speed up your energy regeneration up to 2.5X Unlock Level 3",
      coins: 40000,
    },
    {
      lvl: 4,
      message: "Speed up your energy regeneration up to 3X Unlock Level 4",
      coins: 80000,
    },
    {
      lvl: 5,
      message: "Speed up your energy regeneration up to 3.5X Unlock Level 5",
      coins: 160000,
    },
    {
      lvl: 6,
      message: "Speed up your energy regeneration up to 4X Unlock Level 6",
      coins: 320000,
    },
  ];
  const TurboBooster = [
    {
      lvl: 1,
      message:
        "Boost your tapping power and deal more damage to the eggs up to 2X on Level 1",
      coins: 10000,
    },
    {
      lvl: 2,
      message:
        "Boost your tapping power and deal more damage to the eggs up to 3X on Level 2",
      coins: 20000,
    },
    {
      lvl: 3,
      message:
        "Boost your tapping power and deal more damage to the eggs up to 4X on Level 3",
      coins: 40000,
    },
    {
      lvl: 4,
      message:
        "Boost your tapping power and deal more damage to the eggs up to 5X on Level 4",
      coins: 80000,
    },
    {
      lvl: 5,
      message:
        "Boost your tapping power and deal more damage to the eggs up to 6X on Level 5",
      coins: 160000,
    },
    {
      lvl: 6,
      message:
        "Boost your tapping power and deal more damage to the eggs up to 7X on Level 6",
      coins: 320000,
    },
  ];

  useEffect(() => {
    const coin = JSON.parse(localStorage.getItem("userData"))?.user.coins;

    const timer = setTimeout(() => {
      setModalStyle(
        "opacity-100 translate-y-0 transition-all duration-200 ease-out"
      );

      if (boosterType === "turbo") {
        if (coin < TurboBooster[turboBoosterLevel - 1].coins) {
          toast.error(
            <Mesg
              title={"Insufficient funds"}
              desc={"You don't have enough funds"}
              img={"/common/warning.svg"}
            />,
            {
              icon: false,
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
        }
        setBoosterValues(TurboBooster[turboBoosterLevel - 1]);
      } else {
        if (coin < RechargeBootser[energyBoosterLevel - 1].coins) {
          toast.error(
            <Mesg
              title={"Insufficient funds"}
              desc={"You don't have enough funds"}
              img={"/common/warning.svg"}
            />,
            {
              icon: false,
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
        }
        setBoosterValues(RechargeBootser[energyBoosterLevel - 1]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const determineEggLevel = (noOfTaps) => {
    if (noOfTaps >= 16000000) {
      return 6;
    } else if (noOfTaps >= 8000000) {
      return 5;
    } else if (noOfTaps >= 4000000) {
      return 4;
    } else if (noOfTaps >= 2000000) {
      return 3;
    } else if (noOfTaps >= 1000000) {
      return 2;
    } else {
      return 1;
    }
  };

  const addBooster = async (e) => {
    tele.HapticFeedback.notificationOccurred("success");
    e.preventDefault();
    const accessToken = Cookies.get("Authorization");

    try {
      const boostData = {
        boosterType: boosterType,
      };

      const response = await claimBooster(boostData, accessToken);
      setError(null);
      handleCloseModal();
      Cookies.set("lvl", determineEggLevel(gameData.user.coins - price));
      if (boosterType === "turbo") {
        gameData.game.turboBoosterLevel += 1;
      } else {
        gameData.game.energyBoosterLevel += 1;
      }
      localStorage.setItem("userData", JSON.stringify(gameData));
      window.location.reload();
      toast.success(
        <Mesg
          title={"Booster claimed!"}
          desc={"Gear up for the next level! 🌟`"}
          img={"/icons/booster.png"}
        />,
        {
          icon: false,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } catch (error) {
      console.error("Error fetching game stats:", error);
      handleCloseModal();
    }
  };

  useEffect(() => {
    if (boosterType === "turbo") {
      setPrice(TurboBooster[gameData.game.turboBoosterLevel - 1].coins);
    } else {
      setPrice(TurboBooster[gameData.game.energyBoosterLevel - 1].coins);
    }
  }, []);

  return (
    <div
      className={`fixed ${modalStyle} select-none inset-0 flex justify-center items-end z-50 bg-gray-900 bg-opacity-80`}
    >
      <div className="bg-modal opacity-90 rounded-tl-3xl rounded-tr-3xl max-w-full mx-auto p-6 w-full shadow-lg pb-10">
        {/* Modal Header */}
        <div className="flex justify-between items-centerw-full">
          <div className="w-full flex justify-center my-4">
            <div className="border-[4px] border-gray-900 opacity-80 rounded-full border-t w-12 ml-10"></div>
          </div>
          <button onClick={handleCloseModal}>
            <img src="/common/close.svg" alt="Close" className="w-8 h-8" />
          </button>
        </div>

        {/* Icon */}
        <>
          <div className="flex flex-col justify-center items-center mb-1 mt-4">
            <span
              className="font-GAMERIA text-center text-[2.5rem] uppercase text-stroke text-shadow-3"
              style={{ letterSpacing: "1px" }}
            >
              {boosterType === "turbo" ? "Turbo" : "Refill"}. Lv
              {boosterType === "turbo" ? turboBoosterLevel : energyBoosterLevel}
            </span>
          </div>
          <div className="rounded-xl pt-3 flex justify-center items-center mx-auto mb-4">
            <img
              src={`/common/${boosterType}.png`}
              alt="task-icon"
              className="w-[120px] h-[120px]"
            />
          </div>
          {/* Coin and Text */}
          <div className="flex flex-col justify-center items-center">
            <span className="font-GAMERIA text-center text-[1.6rem] font-bold uppercase text-stroke-2 text-shadow-2">
              {boosterValues?.coins?.toLocaleString()}
            </span>
            <span className="font-montaga font-thin text-modalText text-center mt-3 text-lg">
              {boosterValues?.message}
            </span>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center">
            <p className="text-red-500 text-[16px] mb-2">{error}</p>

            <Button
              action={addBooster}
              message={`Upgrade to LVL${
                boosterType === "turbo" ? turboBoosterLevel : energyBoosterLevel
              }`}
            />
          </div>
        </>
      </div>
    </div>
  );
};

export default BoostModal;
