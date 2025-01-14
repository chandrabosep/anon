/* eslint-disable react-hooks/rules-of-hooks */
//@ts-nocheck
"use client";

import { BELLECOUR_CHAIN_ID, IEXEC_APP, IEXEC_APP_WHITELIST, createArrayBufferFromFile } from "@/utils/iExec/utils";
import { IExecDataProtector, ProtectedData } from "@iexec/dataprotector";
import JSZip from "jszip";
import { toast } from "sonner";
import { useSwitchChain } from "wagmi";

/* eslint-disable react-hooks/rules-of-hooks */
//@ts-nocheck

/* eslint-disable react-hooks/rules-of-hooks */
//@ts-nocheck

/* eslint-disable react-hooks/rules-of-hooks */
//@ts-nocheck

/* eslint-disable react-hooks/rules-of-hooks */
//@ts-nocheck

/* eslint-disable react-hooks/rules-of-hooks */
//@ts-nocheck

/* eslint-disable react-hooks/rules-of-hooks */
//@ts-nocheck

/* eslint-disable react-hooks/rules-of-hooks */
//@ts-nocheck

/* eslint-disable react-hooks/rules-of-hooks */
//@ts-nocheck

/* eslint-disable react-hooks/rules-of-hooks */
//@ts-nocheck

/* eslint-disable react-hooks/rules-of-hooks */
//@ts-nocheck

const dataProtector = new IExecDataProtector(window.ethereum);

export const useiExec = () => {
  const { switchChain } = useSwitchChain();

  const checkUserAddress = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const userAddress = accounts?.[0];

      if (!userAddress) {
        return {
          data: null,
          error: {
            message: "Missing user address",
            value: true,
          },
        };
      } else {
        return {
          data: userAddress,
          error: null,
        };
      }
    } catch (error) {
      return {
        data: null,
        error: {
          message: "Error fetching user address",
          value: true,
        },
      };
    }
  };

  // const createFile = async (data: string, dataName: string) => {
  //   if (!data || !dataName) {
  //     return {
  //       data: null,
  //       error: {
  //         message: "Missing data or data name",
  //         value: true,
  //       },
  //     };
  //   }

  //   const blob = new Blob([data], { type: "text/plain" });
  //   const file = new File([blob], dataName, { type: "text/plain" });

  //   return { data: file, error: null };
  // };

  const checkCorrectChain = async () => {
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      if (Number(chainId) !== BELLECOUR_CHAIN_ID) {
        toast("Invalid network, trying to switch to Bellecour network...");
        switchChain({ chainId: BELLECOUR_CHAIN_ID });

        return {
          data: null,
          error: {
            message: "Invalid network",
            value: true,
          },
        };
      } else {
        return {
          data: chainId,
          error: null,
        };
      }
    } catch (error) {
      return {
        data: null,
        error: {
          message: "Error fetching chain ID",
          value: true,
        },
      };
    }
  };

  const checkETHProvider = async () => {
    if (!window.ethereum) {
      return {
        data: null,
        error: {
          message: "Missing Ethereum provider. Please install Metamask.",
          value: true,
        },
      };
    } else {
      return {
        data: window.ethereum,
        error: null,
      };
    }
  };

  const checkSession = async () => {
    const { data: ethProvider, error: ethProviderError } = await checkETHProvider();
    const { data: userAddress, error } = await checkUserAddress();
    const { data: chainId, error: chainIdError } = await checkCorrectChain();

    if (ethProviderError?.value || error?.value || chainIdError?.value) {
      return {
        data: null,
        error: {
          message: "Error checking user address, chain ID, or ETH provider",
          value: true,
        },
      };
    }

    if (!ethProvider || !userAddress || !chainId) {
      return {
        data: null,
        error: {
          message: "Missing ETH provider, user address or chain ID",
          value: true,
        },
      };
    } else {
      return {
        data: {
          ethProvider,
          userAddress,
          chainId,
        },
        error: null,
      };
    }
  };

  // const encryptAndPushData = async (dataString: string, dataName: string) => {
  //   try {
  //     const { data: file, error: fileError } = await createFile(dataString, dataName);
  //     const { data: session, error: sessionError } = await checkSession();

  //     if (sessionError?.value || fileError?.value || !session) {
  //       return {
  //         data: null,
  //         error: {
  //           message: "Error creating file or checking session",
  //           value: true,
  //         },
  //       };
  //     }

  //     if (!file) {
  //       return {
  //         data: null,
  //         error: {
  //           message: "No file to encrypt and push",
  //           value: true,
  //         },
  //       };
  //     }

  //     if (file.size > 500000) {
  //       toast("File size is too large. Please upload a file smaller than 500KB.");
  //       return {
  //         data: null,
  //         error: {
  //           message: "File size is too large. Please upload a file smaller than 500KB.",
  //           value: true,
  //         },
  //       };
  //     }

  //     const bufferFile = await createArrayBufferFromFile(file);

  //     const protectedData = await dataProtector.core.protectData({
  //       name: file.name,
  //       data: {
  //         file: bufferFile,
  //       },
  //     });

  //     const { data, error } = await grantAccess(protectedData.address, session.userAddress);

  //     return {
  //       data: protectedData,
  //       error: null,
  //     };
  //   } catch (error) {
  //     return {
  //       data: null,
  //       error: {
  //         message: "Error encrypting and pushing data",
  //         value: true,
  //       },
  //     };
  //   }
  // };

  // const getMyProtectedData = async () => {
  //   try {
  //     const { data: session, error: sessionError } = await checkSession();

  //     if (sessionError?.value || !session) {
  //       return {
  //         data: null,
  //         error: {
  //           message: "Error creating file or checking session",
  //           value: true,
  //         },
  //       };
  //     }

  //     const protectedDataList = await dataProtector.core.getProtectedData({
  //       owner: session.userAddress,
  //     });

  //     if (!protectedDataList) {
  //       return {
  //         data: [] as ProtectedData[],
  //         error: {
  //           message: "No protected data found",
  //           value: true,
  //         },
  //       };
  //     } else {
  //       return {
  //         data: protectedDataList,
  //         error: null,
  //       };
  //     }
  //   } catch (error) {
  //     return {
  //       data: null,
  //       error: {
  //         message: "Error fetching protected data",
  //         value: true,
  //       },
  //     };
  //   }
  // };

  // const grantAccess = async (_protectedData: string, _authorizedUser: string) => {
  //   try {
  //     const { data: session, error: sessionError } = await checkSession();

  //     if (sessionError?.value || !session) {
  //       return {
  //         data: null,
  //         error: {
  //           message: "Error creating file or checking session",
  //           value: true,
  //         },
  //       };
  //     }

  //     const grantedAccess = await dataProtector.core.grantAccess({
  //       protectedData: _protectedData,
  //       authorizedApp: IEXEC_APP,
  //       authorizedUser: _authorizedUser,
  //       pricePerAccess: 0,
  //       numberOfAccess: 100000000000,
  //     });

  //     return {
  //       data: grantedAccess,
  //       error: null,
  //     };
  //   } catch (error) {
  //     return {
  //       data: null,
  //       error: {
  //         message: `Error granting access to ${_authorizedUser} to access ${_protectedData}`,
  //         value: true,
  //       },
  //     };
  //   }
  // };

  // const decompressArrayBuffer = async (input: ArrayBuffer, fileName: string): Promise<Uint8Array> => {
  //   try {
  //     const zip = await JSZip.loadAsync(input);
  //     const file = zip.file(fileName);

  //     if (!file) {
  //       throw new Error(`File "${fileName}" not found in the ZIP archive.`);
  //     }

  //     const content = await file.async("uint8array");
  //     return content;
  //   } catch (error) {
  //     throw new Error("Error decompressing ZIP archive");
  //   }
  // };

  // const decryptData = async (_protectedData: string) => {
  //   try {
  //     const { data: session, error: sessionError } = await checkSession();

  //     if (sessionError?.value || !session) {
  //       return {
  //         data: null,
  //         error: {
  //           message: "Error creating file or checking session",
  //           value: true,
  //         },
  //       };
  //     }

  //     const processProtectedDataResponse = await dataProtector.core.processProtectedData({
  //       protectedData: _protectedData,
  //       app: IEXEC_APP,
  //       maxPrice: 0,
  //     });

  //     console.log("processProtectedDataResponse", processProtectedDataResponse);

  //     const file = await decompressArrayBuffer(processProtectedDataResponse.result, "content");

  //     return {
  //       data: file,
  //       error: null,
  //     };
  //   } catch (error) {
  //     return {
  //       data: null,
  //       error: {
  //         message: "Error decrypting data",
  //         value: true,
  //       },
  //     };
  //   }
  // };

  // const consumeData = async (_protectedData: string) => {
  //   const { data: session, error: sessionError } = await checkSession();

  //   if (sessionError?.value || !session) {
  //     return {
  //       data: null,
  //       error: {
  //         message: "Error creating file or checking session",
  //         value: true,
  //       },
  //     };
  //   }

  //   const consumeProtectedDataResult = await dataProtector.core.consumeProtectedData({
  //     protectedData: _protectedData,
  //     app: IEXEC_APP,
  //   });

  //   return { data: consumeProtectedDataResult.result };
  // };

  const createCollection = async () => {
    const { data: session, error: sessionError } = await checkSession();

    if (sessionError?.value || !session) {
      return {
        data: null,
        error: {
          message: "Error creating file or checking session",
          value: true,
        },
      };
    }

    const createCollectionResult = await dataProtector.sharing.createCollection();

    return createCollectionResult;
  };

  const subscribeToCollection = async (collectionId: number) => {
    const { data: session, error: sessionError } = await checkSession();

    if (sessionError?.value || !session) {
      return {
        data: null,
        error: {
          message: "Error creating file or checking session",
          value: true,
        },
      };
    }

    const subscribeToCollectionResult = await dataProtector.sharing.setSubscriptionParams({
      collectionId: collectionId,
      price: 0,
      duration: 1000000000000,
    });

    return subscribeToCollectionResult;
  };

  const createCollectionAndSubscribe = async () => {
    const collection = await createCollection().then(async res => {
      console.log("res", res);
      // @ts-ignore
      const subscribeToCollectionResult = await subscribeToCollection(res?.collectionId as number);
      return { collection: res, subscribeToCollectionResult };
    });
    console.log(collection);
    return collection;
  };

  const getSubscribedData = async (collectionId: number) => {
    console.log("collectionId", collectionId);
    const { data: session, error: sessionError } = await checkSession();

    if (sessionError?.value || !session) {
      return {
        data: null,
        error: {
          message: "Error creating file or checking session",
          value: true,
        },
      };
    }
    console.log("collectionId222", collectionId);
    const subscribedData = await dataProtector.sharing.getProtectedDataInCollections({
      collectionId: collectionId,
    });
    console.log("subscribedData", subscribedData);
    return subscribedData;
  };

  const setProtectedDataToSubscription = async (title: string, content: string, collectionId: number) => {
    const { data: session, error: sessionError } = await checkSession();

    if (sessionError?.value || !session) {
      return {
        data: null,
        error: {
          message: "Error creating file or checking session",
          value: true,
        },
      };
    }

    try {
      // Protect the data using dataProtector
      const protectedData = await dataProtector.core.protectData({
        name: title,
        data: {
          title: title,
          content: content,
        },
      });
    
      console.log("protectedData", protectedData);
    
      if (!protectedData?.address) {
        throw new Error("Failed to protect data.");
      }
    
      // Add the protected data to the collection
      const addToCollectionResult = await dataProtector.sharing.addToCollection({
        protectedData: protectedData.address,
        collectionId: collectionId,
        addOnlyAppWhitelist: IEXEC_APP_WHITELIST,
      });
    
      console.log("addToCollectionResult", addToCollectionResult);
    
      if (!addToCollectionResult) {
        throw new Error("Failed to add data to collection.");
      }
    
      // Check the session
      const { data: session, error: sessionError } = await checkSession();
    
      if (sessionError?.value || !session) {
        return {
          data: null,
          error: {
            message: "Error creating file or checking session",
            value: true,
          },
        };
      }
    
      // Set the protected data to the subscription
      const setProtectedDataToSub = await dataProtector.sharing.setProtectedDataToSubscription({
        protectedData: protectedData.address,
      });
    
      if (!setProtectedDataToSub) {
        throw new Error("Failed to set protected data to subscription.");
      }
    
      console.log("Protected data successfully processed:", setProtectedDataToSub);
      console.log("final", { setProtectedDataToSub, protectedData: protectedData?.address });
    
      // Return the protected data address
      return {
        data: protectedData?.address,
        error: null,
      };
    } catch (error) {
      console.error("Error during data protection flow:", error);
    
      // Explicitly return an error structure
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : "An error occurred while protecting data.",
          value: true,
        },
      };
    }
  };

  const getProtectedData = async (collectionId: number) => {
    const { data: session, error: sessionError } = await checkSession();

    if (sessionError?.value || !session) {
      return {
        data: null,
        error: {
          message: "Error checking session",
          value: true,
        },
      };
    }

    try {
      // Fetch protected data in the collection
      const protectedDataResult = await dataProtector.sharing.getProtectedDataInCollections({
        collectionId: collectionId,
      });
      // console.log("protectedDataResult", protectedDataResult);

      if (!protectedDataResult?.protectedDataInCollection) {
        throw new Error("No protected data found in the collection.");
      }

      // console.log("Protected Data in Collection:", protectedDataResult.protectedDataInCollection);

      const data = await dataProtector.sharing.consumeProtectedData({
        protectedData: protectedDataResult.protectedDataInCollection[0]?.address,
        app: IEXEC_APP,
        workerpool: `prod-v8-learn.main.pools.iexec.eth`,
        // onStatusUpdate: status => {
        //   console.log(`[consumeProtectedData] status`, status);
        // },
      });

      const getResultFromCompletedTask = async () => {
        setErrorMessage("");
        try {
          checkIsConnected();
        } catch (err) {
          setErrorMessage("Please install MetaMask");
          return;
        }
        await checkCurrentChain();
        try {
          setResultFromCompletedTaskSuccess(false);
          setIsLoadingGetResultFromCompletedTask(true); // Show loader
          const taskResult = await dataProtector.sharing.getResultFromCompletedTask({
            taskId: data.taskId,
            // The consuming app provided by iExec will store its result in a file named "content"
            path: "content",
            onStatusUpdate: status => {
              console.log("[getResultFromCompletedTask] status", status);
            },
          });
          const decodedText = new TextDecoder().decode(taskResult.result);
          console.log("decodedText", decodedText);
          setContent(decodedText);
          setIsLoadingGetResultFromCompletedTask(false); // hide loader
          setResultFromCompletedTaskSuccess(true); // show success icon
        } catch (e) {
          setIsLoadingGetResultFromCompletedTask(false); // hide loader
          console.error(e);
        }
      };

      // const resolvedData = await Promise.all(
      //   protectedDataResult.protectedDataInCollection.map(async item => {
      //     if (!item?.address) {
      //       throw new Error("Invalid protected data address.");
      //     }
      //     console.log(`item ${item.address}`, item);
      //     try {
      //       // Consume the protected data
      //       const consumedData = await dataProtector.sharing.consumeProtectedData({
      //         protectedData: item?.address,
      //         app: IEXEC_APP,
      //       });
      //       console.log(`consumedData ${item.address}`, consumedData);
      //       return consumedData;
      //     } catch (consumeError) {
      //       console.error(`Error consuming protected data for address ${item.address}:`, consumeError);
      //       return {
      //         error: `Failed to consume protected data for address ${item.address}`,
      //       };
      //     }
      //   }),
      // );

      // console.log("Resolved Protected Data:", resolvedData);
      return {
        data: resolvedData,
        error: null,
      };
    } catch (error) {
      console.error("Error retrieving or processing protected data:", error);
      return {
        data: null,
        error: {
          message: error.message || "An error occurred while retrieving protected data.",
          value: true,
        },
      };
    }
  };

  const subscribeToOrganization = async (collectionId: number) => {
    const { data: session, error: sessionError } = await checkSession();

    if (sessionError?.value || !session) {
      return {
        data: null,
        error: {
          message: "Error checking session",
          value: true,
        },
      };
    }

    const subscribeToCollectionResult = await dataProtector.sharing.subscribeToCollection({
      collectionId: collectionId,
      price: 0,
      duration: 1000000000000,
    });

    console.log("subscribeToCollectionResult", subscribeToCollectionResult);

    return subscribeToCollectionResult;
  };

  return {
    createCollection,
    createCollectionAndSubscribe,
    getSubscribedData,
    setProtectedDataToSubscription,
    getProtectedData,
    subscribeToOrganization,
  };
};
