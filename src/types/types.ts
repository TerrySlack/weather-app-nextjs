interface ILocation {
  name: string;
  region: string;
  country: string;
  localtime: string;
}

interface ICondition {
  text: string;
  icon: string;
}
interface ICurrent {
  condition: ICondition;
  temp_c: number;
  temp_f: number;
  wind_mph: number;
  wind_kph: number;
  humidity: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
}
export type ICity = {
  selected?: boolean;
  location: ILocation;
  current: ICurrent;
};

export interface CityState {
  cityData: ICity | undefined;
  loading: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  allCities: ICity[];
  error?: string;
}
