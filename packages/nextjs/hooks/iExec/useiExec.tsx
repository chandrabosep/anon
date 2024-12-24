// @ts-nocheck
"use client";

import { BELLECOUR_CHAIN_ID, IEXEC_APP, createArrayBufferFromFile } from "@/utils/iExec/utils";
import { IExecDataProtector, ProtectedData } from "@iexec/dataprotector";
import JSZip from "jszip";
import { toast } from "sonner";
import { useSwitchChain } from "wagmi";

// @ts-nocheck

// @ts-nocheck

// @ts-nocheck

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

  const createFile = async (data: string, dataName: string) => {
    if (!data || !dataName) {
      return {
        data: null,
        error: {
          message: "Missing data or data name",
          value: true,
        },
      };
    }

    const blob = new Blob([data], { type: "text/plain" });
    const file = new File([blob], dataName, { type: "text/plain" });

    return { data: file, error: null };
  };

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

  const encryptAndPushData = async (dataString: string, dataName: string) => {
    try {
      const { data: file, error: fileError } = await createFile(dataString, dataName);
      const { data: session, error: sessionError } = await checkSession();

      if (sessionError?.value || fileError?.value || !session) {
        return {
          data: null,
          error: {
            message: "Error creating file or checking session",
            value: true,
          },
        };
      }

      if (!file) {
        return {
          data: null,
          error: {
            message: "No file to encrypt and push",
            value: true,
          },
        };
      }

      if (file.size > 500000) {
        toast("File size is too large. Please upload a file smaller than 500KB.");
        return {
          data: null,
          error: {
            message: "File size is too large. Please upload a file smaller than 500KB.",
            value: true,
          },
        };
      }

      const bufferFile = await createArrayBufferFromFile(file);

      const protectedData = await dataProtector.protectData({
        name: file.name,
        data: {
          file: bufferFile,
        },
      });

      const { data, error } = await grantAccess(protectedData.address, session.userAddress);

      return {
        data: protectedData,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: "Error encrypting and pushing data",
          value: true,
        },
      };
    }
  };

  const getMyProtectedData = async () => {
    try {
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

      const protectedDataList = await dataProtector.fetchProtectedData({
        owner: session.userAddress,
      });

      if (!protectedDataList) {
        return {
          data: [] as ProtectedData[],
          error: {
            message: "No protected data found",
            value: true,
          },
        };
      } else {
        return {
          data: protectedDataList,
          error: null,
        };
      }
    } catch (error) {
      return {
        data: null,
        error: {
          message: "Error fetching protected data",
          value: true,
        },
      };
    }
  };

  const grantAccess = async (_protectedData: string, _authorizedUser: string) => {
    try {
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

      const grantedAccess = await dataProtector.grantAccess({
        protectedData: _protectedData,
        authorizedApp: IEXEC_APP,
        authorizedUser: _authorizedUser,
        pricePerAccess: 0,
        numberOfAccess: 100000000000,
      });

      return {
        data: grantedAccess,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: `Error granting access to ${_authorizedUser} to access ${_protectedData}`,
          value: true,
        },
      };
    }
  };

  const decompressArrayBuffer = async (input: ArrayBuffer, fileName: string): Promise<Uint8Array> => {
    try {
      const zip = await JSZip.loadAsync(input);
      const file = zip.file(fileName);

      if (!file) {
        throw new Error(`File "${fileName}" not found in the ZIP archive.`);
      }

      const content = await file.async("uint8array");
      return content;
    } catch (error) {
      throw new Error("Error decompressing ZIP archive");
    }
  };

  const decryptData = async (_protectedData: string) => {
    try {
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

      const processProtectedDataResponse = await dataProtector.processProtectedData({
        protectedData: _protectedData,
        app: IEXEC_APP,
        maxPrice: 0,
      });

      console.log("processProtectedDataResponse", processProtectedDataResponse);

      const file = await decompressArrayBuffer(processProtectedDataResponse.result, "content");

      return {
        data: file,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: "Error decrypting data",
          value: true,
        },
      };
    }
  };

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

  //   const consumeProtectedDataResult = await dataProtector.pro({
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

    const createCollectionResult = await dataProtector.createCollection();

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

    const subscribeToCollectionResult = await dataProtector.setSubscriptionParams({
      collectionTokenId: Number(collectionId),
      priceInNRLC: BigInt(0),
      durationInSeconds: 1000000000000,
    });

    return subscribeToCollectionResult;
  };

  const addDataToCollection = async (protectedData: string, collectionId: string) => {
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

    const addToCollectionResult = await dataProtector.addToCollection({
      protectedData: protectedData,
      collectionId: collectionId,
    });

    return addToCollectionResult;
  };

  const createCollectionAndSubscribe = async () => {
    const collection = await createCollection().then(async res => {
      const subscribeToCollectionResult = await subscribeToCollection(res?.collectionTokenId as number);
      return { collection: res, subscribeToCollectionResult };
    });
    console.log(collection);
    return collection;
  };

  return {
    encryptAndPushData,
    getMyProtectedData,
    grantAccess,
    decryptData,
    // consumeData,
    createCollection,
    addDataToCollection,
    createCollectionAndSubscribe,
  };
};
