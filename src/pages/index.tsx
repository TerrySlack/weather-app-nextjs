import { useState, ChangeEvent, MouseEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import {
  selectAllCities,
  selectError,
  selectLoading,
  selectSelectedCity,
} from "@/selectors";
import { AppDispatch } from "@/store/store";
import { useHighlightOnFocus } from "@/hooks/useSelectText";
import { fetchData, throttledFetchData } from "@/store";
import { CitySearch } from "@/components/CitySearch";
import { CityDetails } from "@/components/CityDetails";
import { CityButtons } from "@/components/CityButtons";
import { GetServerSidePropsContext } from "next";
import { ICity } from "@/types";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import {
  setFailed,
  updateAllCitiesThunk,
  updateCityData,
} from "@/store/slices/cityWeatherSlice";

interface HomeProps {
  city: string;
  initialCityData: ICity;
  error?: string;
}

export default function Home({
  city: initialCity,
  initialCityData,
  error: initialCityError,
}: HomeProps) {
  const router = useRouter();
  const { get: getSearchedCities, set: setSearchedCities } = useSessionStorage<
    string,
    string[] | null //For the Generics, string is the T for the set methods 2nd parameter, T is the return type for the get method
  >("cities", []);
  const [city, setCity] = useState<string>(initialCity);
  const dispatch = useDispatch<AppDispatch>();
  const allCities = useSelector(selectAllCities);
  const selectedCity = useSelector(selectSelectedCity);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  // Select the text in an input box, on focus
  const { ref, onFocus } = useHighlightOnFocus();
  const onCitySearchClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();

    //Update the query string, to allow server side props access to the city searched for
    router.push(`/?city=${city}`, undefined, { shallow: true }); // Update query string

    dispatch(throttledFetchData(city)); // Fetch data
    setCity(city);

    //Update the cities entry in session storage
    setSearchedCities("cities", city);
  };

  const onPreviouslySelectedCityClick =
    (previousCity: string) => (e: MouseEvent<HTMLElement>) => {
      e.preventDefault();

      //Update the query string, to allow server side props access to the city searched for
      router.push(`/?city=${previousCity}`, undefined, { shallow: true });
      dispatch(throttledFetchData(previousCity));
      setCity(previousCity);
      setSearchedCities("cities", previousCity);
    };
  // TODO:  Debounce this
  const onCitySearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCity(value);
  };

  useEffect(() => {
    //If there was an error during ssr, dispatchit.
    if (initialCityError) dispatch(setFailed(initialCityError));
  }, [initialCityError, dispatch]);

  useEffect(() => {
    if (initialCityData) updateCityData(initialCityData);
  }, [initialCityData]);

  useEffect(() => {
    // Pre-populate city data if available
    if (initialCity.length > 0) {
      dispatch(throttledFetchData(initialCity));
    }
  }, [initialCity, dispatch]);

  useEffect(() => {
    //Client side only.
    const previouslySearchedCities = getSearchedCities("cities");
    if (previouslySearchedCities && previouslySearchedCities.length > 0) {
      dispatch(updateAllCitiesThunk(previouslySearchedCities));
    }
  }, [getSearchedCities, dispatch]);

  return (
    <div>
      <div className="flex flex-col items-center bg-black text-white p-6">
        <h1 className="text-4xl mb-6">Weather App</h1>
        <CitySearch
          ref={ref}
          city={city}
          isLoading={loading}
          onSearchClick={onCitySearchClick}
          onChange={onCitySearchChange}
          onFocus={onFocus}
        />
      </div>
      {error && (
        <p className="flex flex-col items-center bg-black text-white p-6">
          Error fetching weather data.
        </p>
      )}
      {/* This should only render the current city */}
      {selectedCity && <CityDetails city={selectedCity} />}
      {allCities && allCities.length > 0 && (
        <CityButtons
          cities={allCities}
          onCityClick={onPreviouslySelectedCityClick}
        />
      )}
    </div>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const city = context.query.city as string;

  if (!city) {
    return { props: { city: "", data: null } };
  }

  try {
    //Get the city weather data
    const data = await fetchData(city);
    return { props: { city, initialCityData: data ?? null } };
  } catch (error) {
    const errorMessage = (error as Error).message;
    return { props: { city, error: errorMessage } };
  }
};
