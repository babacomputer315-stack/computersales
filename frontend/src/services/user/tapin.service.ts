import { token } from "@/components/site/shared/Modal/AddAddressModal";
import axios from "axios";

export interface State {
  title: string;
  code: number;
}

export interface City {
  title: string;
  code: number;
}

export interface TapinListResponse<T> {
  entries: {
    list: T[];
  };
}

class TapinService {
  // Get all states
  async getStates(): Promise<TapinListResponse<State>> {
    const response = await axios.post(
      `https://api.tapin.ir/api/v2/public/state/list/`,
      {
        count: 100,
        page: 1,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return response?.data;
  }
  // Get states cities
  async getStatesCities(stateId: string): Promise<TapinListResponse<City>> {
    const response = await axios.post(
      `https://api.tapin.ir/api/v2/public/city/list/`,
      {
        count: 100,
        page: 1,
        state_code: stateId,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return response?.data;
  }
}

export default new TapinService();
