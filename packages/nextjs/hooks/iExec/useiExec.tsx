"use client";

import { BELLECOUR_CHAIN_ID, IEXEC_APP, createArrayBufferFromFile } from "@/utils/iExec/utils";
import { IExecDataProtector, ProtectedData } from "@iexec/dataprotector";
import JSZip from "jszip";
import { toast } from "sonner";
import { useSwitchChain } from "wagmi";

export const useiExec = () => {
  const { switchChain } = useSwitchChain();

  const checkUserAddress = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // @ ts-ignore
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
    if (!data || !dataName)
      return {
        data: null,
        error: {
          message: "Missing data or data name",
          value: true,
        },
      };
    var blob = new Blob([data], { type: "text/plain" });
    var file = new File([blob], dataName, { type: "text/plain" });

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

    if (ethProviderError?.value || error?.value || chainIdError?.value)
      return {
        data: null,
        error: {
          message: "Error checking user address, chain ID or ETH provider",
          value: true,
        },
      };

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

      if (sessionError?.value || fileError?.value || !session)
        return {
          data: null,
          error: {
            message: "Error creating file or checking session",
            value: true,
          },
        };

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
      const dataProtector = new IExecDataProtector(window.ethereum);
      const protectedData = await dataProtector.core.protectData({
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

      if (sessionError?.value || !session)
        return {
          data: null,
          error: {
            message: "Error creating file or checking session",
            value: true,
          },
        };

      const dataProtector = new IExecDataProtector(window.ethereum);

      const protectedDataList = await dataProtector.core.getProtectedData({
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

      if (sessionError?.value || !session)
        return {
          data: null,
          error: {
            message: "Error creating file or checking session",
            value: true,
          },
        };

      const dataProtector = new IExecDataProtector(window.ethereum);

      const grantedAccess = await dataProtector.core.grantAccess({
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
    // Load the ZIP archive
    const zip = await JSZip.loadAsync(input);

    // Find the specific file inside the ZIP
    const file = zip.file(fileName);

    if (!file) {
      throw new Error(`File "${fileName}" not found in the ZIP archive.`);
    }

    // Extract the file content as Uint8Array
    const content = await file.async("uint8array");
    return content;
  };

  const decryptData = async (_protectedData: string) => {
    try {
      const { data: session, error: sessionError } = await checkSession();

      if (sessionError?.value || !session)
        return {
          data: null,
          error: {
            message: "Error creating file or checking session",
            value: true,
          },
        };

      const dataProtectorCore = new IExecDataProtector(window.ethereum);

      const processProtectedDataResponse = await dataProtectorCore.core.processProtectedData({
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
        error: {
          message: `Error decrypting data` + error,
          value: true,
        },
      };
    }
  };

  const consumeData = async (_protectedData: string) => {
    const { data: session, error: sessionError } = await checkSession();

    if (sessionError?.value || !session)
      return {
        data: null,
        error: {
          message: "Error creating file or checking session",
          value: true,
        },
      };

    const dataProtector = new IExecDataProtector(window.ethereum);
    const dataProtectorSharing = dataProtector.sharing;

    const consumeProtectedDataResult = await dataProtectorSharing.consumeProtectedData({
      protectedData: "0x6e10c706999f7dd6e4c05b1937a9cc47945020d4",
      app: IEXEC_APP,
    });

    return { data: consumeProtectedDataResult.result };
  };

  const createCollection = async () => {
    const { data: session, error: sessionError } = await checkSession();

    if (sessionError?.value || !session)
      return {
        data: null,
        error: {
          message: "Error creating file or checking session",
          value: true,
        },
      };

    const dataProtector = new IExecDataProtector(window.ethereum);
    const dataProtectorSharing = dataProtector.sharing;

    const createCollectionResult = await dataProtectorSharing.createCollection();

    console.log(createCollectionResult);
  };

  const addDataToCollection = async () => {
    const { data: session, error: sessionError } = await checkSession();

    if (sessionError?.value || !session)
      return {
        data: null,
        error: {
          message: "Error creating file or checking session",
          value: true,
        },
      };

    const dataProtector = new IExecDataProtector(window.ethereum);
    const dataProtectorSharing = dataProtector.sharing;
    const { txHash } = await dataProtectorSharing.addToCollection({
      protectedData: "0x6e10c706999f7dd6e4c05b1937a9cc47945020d4",
      collectionId: 165,
      addOnlyAppWhitelist: "0x256bcd881c33bdf9df952f2a0148f27d439f2e64",
    });

    console.log(txHash);
  };

  const setProtectedDataToRenting = async () => {
    const { data: session, error: sessionError } = await checkSession();

    if (sessionError?.value || !session)
      return {
        data: null,
        error: {
          message: "Error creating file or checking session",
          value: true,
        },
      };

    const dataProtector = new IExecDataProtector(window.ethereum);
    const dataProtectorSharing = dataProtector.sharing;

    const setForRentingResult = await dataProtectorSharing.setProtectedDataToRenting({
      protectedData: "0x6e10c706999f7dd6e4c05b1937a9cc47945020d4",
      price: 0, // 1 nRLC
      duration: 60 * 60 * 24 * 30, // 30 days
    });

    console.log(setForRentingResult);
  };

  const getrotectedDataInCollection = async () => {
    const { data: session, error: sessionError } = await checkSession();

    if (sessionError?.value || !session)
      return {
        data: null,
        error: {
          message: "Error creating file or checking session",
          value: true,
        },
      };

    const dataProtector = new IExecDataProtector(window.ethereum);
    const dataProtectorSharing = dataProtector.sharing;

    const oneProtectedData = await dataProtectorSharing.getProtectedDataInCollections({
      protectedData: "0x6e10c706999f7dd6e4c05b1937a9cc47945020d4",
    });

    console.log(oneProtectedData);
  };

  const removeProtectedDataFromCollection = async () => {
    const { data: session, error: sessionError } = await checkSession();

    if (sessionError?.value || !session)
      return {
        data: null,
        error: {
          message: "Error creating file or checking session",
          value: true,
        },
      };

    const dataProtector = new IExecDataProtector(window.ethereum);
    const dataProtectorSharing = dataProtector.sharing;

    const { txHash } = await dataProtectorSharing.removeProtectedDataFromCollection({
      protectedData: "0x6e10c706999f7dd6e4c05b1937a9cc47945020d4",
    });
  };

  const rentProtectedData = async () => {
    const { data: session, error: sessionError } = await checkSession();

    if (sessionError?.value || !session)
      return {
        data: null,
        error: {
          message: "Error creating file or checking session",
          value: true,
        },
      };

    const dataProtector = new IExecDataProtector(window.ethereum);
    const dataProtectorSharing = dataProtector.sharing;

    const rentResult = await dataProtectorSharing.rentProtectedData({
      protectedData: "0x123abc...",
      price: 1, // 1 nRLC
      duration: 60 * 60 * 24 * 2, // 172,800 sec = 2 days
    });
  };

  return {
    encryptAndPushData,
    getMyProtectedData,
    grantAccess,
    decryptData,
    consumeData,
    createCollection,
    addDataToCollection,
    setProtectedDataToRenting,
    getrotectedDataInCollection,
    removeProtectedDataFromCollection,
  };
};
