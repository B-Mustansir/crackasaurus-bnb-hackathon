import { client, selectSp } from "./client";
import { getOffchainAuthKeys } from "./utils/offchainAuth";
import { VisibilityType } from "@bnb-chain/greenfield-js-sdk";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import Button from "./common/Button";
import BucketModal from "./common/BucketModal";
import { toast } from "react-toastify";
import Mesg from "./common/ToastMsg";

const tele = window.Telegram?.WebApp;
const Greenfield = () => {
  const navigate = useState();
  const [error, setError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState(null);
  const { address, connector } = useAccount();
  const [bucket, setBucket] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!address) {
      toast.error(
        <Mesg
          title={"Wallet Not Connected"}
          desc={"Please visit profile page to connect wallet."}
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
  }, []);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleUpload = async (file, objectName) => {
    if (!address || !file) {
      toast.error(
        <Mesg
          title={"Wallet not connected"}
          desc={"Please Connect your wallet"}
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
      return;
    }

    const spInfo = await selectSp();
    console.log("Selected SP info:", spInfo);

    const provider = await connector?.getProvider();
    console.log(provider);
    const offChainData = await getOffchainAuthKeys(address, provider);
    if (!offChainData) {
      console.log("No offchain, please create offchain pairs first");
      return;
    }

    try {
      setUploading(true);
      const res = await client.object.delegateUploadObject(
        {
          bucketName: Cookies.get("bucketName"),
          objectName: objectName,
          body: file,
          delegatedOpts: {
            visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
          },
          onProgress: (e) => {
            console.log("Upload progress:", e.percent);
          },
        },
        {
          type: "EDDSA",
          address: address,
          domain: window.location.origin,
          seed: offChainData.seedString,
        }
      );

      if (res.code === 0) {
        toast.success(
          <Mesg
            title={"File Uploaded Successfully!"}
            desc={"Your file was uploaded to storage!"}
            img={"/common/ton-wood.svg"}
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
      } else {
        toast.error(
          <Mesg
            title={"Failed to Upload File"}
            desc={"There wasa problem uploading the file"}
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
    } catch (err) {
      console.error("Error during upload:", err);
      toast.error(
        <Mesg
          title={"Failed to Upload File"}
          desc={err.message}
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
      // if (err instanceof Error) {
      //   alert(err.message);
      // } else if (err && typeof err === "object") {
      //   alert(JSON.stringify(err));
      // }
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleUpload(file, profile?.tonAddress + "-" + uuidv4());
    }
  };

  // const fetchProfile = async () => {
  //   const accessToken = Cookies.get("Authorization");
  //   try {
  //     const response = await getProfile(accessToken);
  //     setProfile(response);
  //   } catch (error) {
  //     console.error("Error fetching profile:", error);
  //   }
  // };

  useEffect(() => {
    if (Cookies.get("bucketName")) {
      setBucket(Cookies.get("bucketName"));
    }
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (tele) {
          await tele.ready();
          tele.BackButton.show();
          tele.BackButton.onClick(() => navigate("/profile"));
          tele.setHeaderColor("#302d1f");
        } else {
          console.error("Telegram WebApp API not available");
        }
      } catch (error) {
        console.error("Error fetching user data from Telegram:", error);
      }
    };
    getUserData();
  }, []);

  return (
    <div className="overflow-auto bg-gradient-to-b from-Ogradient-middle h-screen to-Ogradient-end flex flex-col items-start justify-center">
      <div className="top-0 w-full h-full z-10 flex flex-col">
        <div className="h-fit flex flex-col justify-center items-center relative hero-explainer-container">
          <img
            src="https://cdn.mappasaurus.com/greenfieldbg.png"
            className="w-full h-[340px] opacity-30"
          />
          <div className="absolute inset-0 flex flex-col items-center mt-4">
            <div className="flex items-center">
              <img
                src="https://cdn.mappasaurus.com/greenfield-icon.png"
                className="h-[200px] w-[200px] mt-10"
              />
            </div>
          </div>
          <div className="flex flex-col absolute bottom-2 items-center z-20">
            <p className="text-[36px] text-center font-GAMERIA text-modalText font-normal uppercase text-stroke2">
              Select Data
            </p>
            <div className="text-[15px] flex gap-1 text-stroke-2 font-GAMERIA justify-center text-center uppercase text-game-shadow-2 -mt-2.5">
              TO LIST ON CHAIN AND EARN $CRACKA
            </div>
          </div>
        </div>
        <div className="flex h-full flex-grow m-5 flex-col items-center">
          <div
            disabled={!bucket}
            onClick={() => {
              if (!bucket) {
                toast.error;
              }
            }}
            className="border-2 h-full justify-center  border-dashed rounded-lg border-[#76725C] px-5 text-center flex flex-col items-center w-full overflow-hidden"
          >
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              multiple
              accept=".mp4, .mov, .avi, .mkv, .webm"
              className="hidden"
            />

            {!uploading ? (
              <div
                onClick={() => document.getElementById("fileInput").click()}
                className="text-modalText font-montaga text-[16px] text-center w-full"
              >
                <p className="uppercase mb-2">Select video file</p>
                <p className="px-2">
                  Maximum 10GB, preferred format is MP4 (H.264) or webm (VP8,
                  VP9)
                </p>
              </div>
            ) : (
              <div className="justify-center text-center items-center py-10">
                <img
                  src="/images/loading.gif"
                  className="-mt-10"
                  alt="loader"
                />
                <p className="text-[15px] flex gap-1 text-stroke-2 font-GAMERIA justify-center text-center uppercase text-game-shadow-2 -mt-2.5">
                  Uploading...
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="mx-2 bottom-3 left-0 right-0">
          {!bucket ? (
            <Button
              message={"Create Bucket"}
              action={() => setShowModal(true)}
            />
          ) : (
            <Button
              message={"Choose File"}
              action={() => document.getElementById("fileInput").click()}
            />
          )}
        </div>
      </div>
      {showModal && <BucketModal handleClose={handleClose} />}
    </div>
  );
};

export default Greenfield;
