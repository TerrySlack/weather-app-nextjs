import { CityState, ICity } from "@/types";
import { throttleFunc } from "@/utils/throttle";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

//api
export const fetchData = async (city: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_WEATHER_URL}&q=${encodeURIComponent(
        city
      )}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

//redux
export const fetchDataThunk = createAsyncThunk(
  "data/fetchData",
  async (city: string, { dispatch, rejectWithValue }) => {
    dispatch(setLoading());

    try {
      const fetchedCity: ICity = await fetchData(city);

      dispatch(updateCityData(fetchedCity));
      dispatch(setSucceeded());
      return fetchedCity;
    } catch (error) {
      const errorMessage = (error as Error).message;
      dispatch(setFailed(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

//Throttle requests to once every 2 seconds, to handle multiple clicks on the search button
export const throttledFetchData = throttleFunc(
  (...args: unknown[]) => fetchDataThunk(args[0] as string),
  2000
);
//redux - for any cities that were previously searched, they were stored in sessionStorage.  Pass them here and update the allCities state
export const updateAllCitiesThunk = createAsyncThunk(
  "citiesWeather/updateAllCitiesThunk",
  async (cities: string[], { dispatch }) => {
    // Dispatch all thunks in parallel and wait for all of them to resolve
    await Promise.all(cities.map((city) => dispatch(fetchDataThunk(city))));
  }
);

const initialState: CityState = {
  allCities: [], //Use a map to ensure no duplicate entries and prevent having to iterate to check on each city added
  status: "idle",
  error: undefined,
  cityData: undefined,
  loading: false,
};

const citiesWeatherSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.status = "loading";
    },
    setSucceeded: (state) => {
      state.status = "succeeded";
    },
    setFailed: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
    },
    updateCityData: (state, action: PayloadAction<ICity>) => {
      const city = action.payload;
      const newCityName = city.location.name.toLocaleLowerCase();
      //Check to ensure that the new city does not exist.  If it does, then just update it, otherwise just push it
      let selectedCity = state.allCities.find(
        ({ location: { name } }: ICity) =>
          name.toLocaleLowerCase() === newCityName
      );

      if (!selectedCity) {
        //add it to allCities
        state.allCities.push(city);
      } else {
        //Update the selectedCity
        selectedCity = city;
      }

      //Iterate through each city and set selected to false, except for the new city
      state.allCities = state.allCities.reduce<ICity[]>((acc, city) => {
        // Your logic here to process each city and push to acc
        //This will set the new city selected property to true and reset all others to false
        city.selected = city.location.name.toLocaleLowerCase() === newCityName;
        acc.push(city);
        return acc;
      }, []);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateAllCitiesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAllCitiesThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateAllCitiesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update cities";
      });
  },
});

export const { setLoading, setSucceeded, setFailed, updateCityData } =
  citiesWeatherSlice.actions;

export const cityWeatherReducer = citiesWeatherSlice.reducer;
