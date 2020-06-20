import axios from 'axios';

export interface NasSensorItem {
  CPUTemp: number,
  Fan2Speed: number,
  Timestamp: string,
  Fan1Speed: number,
  Temp1Temp: number,
  SYSTemp: number
}

interface FetchDataResponse {
  Items: NasSensorItem[];
}

interface FetchDataOptions {
  auth?: {
    token?: string | null;
  };
}

const HOST = process.env.API_HOST;
const SECRET = process.env.API_SECRET;

export const fetchData = async (from: number, to: number, options?: FetchDataOptions): Promise<FetchDataResponse> => {

  const endpoint = `${HOST}/fetch`;
  const config = {
    params: { from, to, secret: SECRET },
    headers: { 'Authorization': `bearer ${options?.auth?.token}` },
  };

  const result = await axios.get<FetchDataResponse>(endpoint, config);
  if (result.status >= 400) {
    throw new Error(result.statusText);
  }

  return result.data;
}