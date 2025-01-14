import { DataSchema } from "@iexec/dataprotector";
import { TimeStamp } from "@iexec/web3mail";

export const BELLECOUR_CHAIN_ID = 134;

export const IEXEC_APP_WHITELIST = "0x256bcd881c33bdf9df952f2a0148f27d439f2e64";

export const IEXEC_APP = "0x1cb7d4f3ffa203f211e57357d759321c6ce49921";


export const isKeyInDataSchema = (dataSchema: DataSchema, key: string): boolean => {
  if (!dataSchema) {
    return false;
  }

  if (key in dataSchema) {
    return true;
  }

  for (const value of Object.values(dataSchema)) {
    if (typeof value === "object" && value !== null && isKeyInDataSchema(value as DataSchema, key)) {
      return true;
    }
  }

  return false;
};

export const getTypeOfProtectedData = (schema?: DataSchema) => {
  return isKeyInDataSchema(schema || {}, "email")
    ? "Email"
    : isKeyInDataSchema(schema || {}, "file")
    ? "File"
    : "Unknown type";
};

export const createArrayBufferFromFile = async (file: File): Promise<Uint8Array> => {
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onerror = () => {
      fileReader.abort();
      reject(new DOMException("Error parsing input file."));
    };
    fileReader.onload = () => {
      resolve(fileReader.result as Uint8Array);
    };
    fileReader.readAsArrayBuffer(file);
  });
};

// from TimeStamp => 2023-06-23T17:46:37.212Z
export const getLocalDateFromTimeStamp = (timestamp: TimeStamp | number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

export const getLocalDateFromBlockchainTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString();
};
