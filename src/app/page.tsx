/** @format */
"use client";

import Navbar from "@/components/Navbar";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import Image from "next/image";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import Container from "@/components/Container";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import { FaCaretUp } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";
import WeatherIcon from "@/components/WeatherIcon";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import WeatherDetails from "@/components/WeatherDetails";
import { metersToMiles } from "@/utils/metersToMiles";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import ForecastWeatherDetail from "@/components/ForecastWeatherDetail";
import { useAtom } from "jotai";
import { placeAtom } from "./atom";
import { useEffect } from "react";


//http://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56

//http://api.openweathermap.org/data/2.5/forecast?q=dhaka&appid=f5d6b8111944c91507b1bee03e7b3cfe&cnt=56

interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}
interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export default function Home() {

  const [place, setPlace] = useAtom(placeAtom);

  const { isLoading, error, data, refetch } = useQuery<WeatherData>(
    "repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    }
  );

  useEffect(()=> {
    refetch();
  }, [place, refetch])

  if (isLoading)
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black"
        style={{ zIndex: 9999 }} // Set a high z-index to ensure it's on top
      >
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="sr-only">Loading...</span>{" "}
          {/* Accessibility: Hide text from screen readers */}
        </div>
      </div>
    );

  const firstData = data?.list[0];

  console.log("data", data?.city.name);

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    ),
  ];

  // Filtering data to get the first entry after 6 AM for each unique date
  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  return (
    <div className="flex flex-col gap-4 bg-cyan-700 min-h-screen">
      <Navbar location={data?.city.name}/>    

      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/** today data */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              <p className="text-lg text-white">
                {" "}
                {format(parseISO(firstData?.dt_txt ?? ""), "EEE")}{" "}
              </p>
              <p className="text-lg text-white">
                {" "}
                {format(parseISO(firstData?.dt_txt ?? ""), "dd/MM/yyyy")}{" "}
              </p>
            </h2>

            <Container className="gap-10 px-6 items-center">
              {/** temperature */}
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {convertKelvinToCelsius(firstData?.main.temp ?? 296.37)}°
                </span>

                <p className="text-xs space-x-1 whitespace-nowrap mt-2">
                  <span>Feels Like</span>
                </p>

                <p className="text-xs space-x-2 flex whitespace-nowrap">
                  <span className="flex">
                    {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}
                    °<FaCaretDown className="text-blue-400" />{" "}
                  </span>
                  <span className="flex">
                    {" "}
                    {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}
                    °<FaCaretUp className="text-red-500" />
                  </span>
                </p>
              </div>

              {/** time and weather icons */}
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((d, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                  >
                    {/** Time */}
                    <p className="whitespace-nowrap">
                      {format(parseISO(d.dt_txt), "h:mm a")}
                    </p>

                    {/**Tempeeature ° */}
                    {/**Weather Icons */}

                    {/* <WeatherIcon iconName={d.weather[0].icon} /> */}
                    <WeatherIcon
                      iconName={getDayOrNightIcon(d.weather[0].icon, d.dt_txt)}
                    />

                    <p>{convertKelvinToCelsius(firstData?.main.temp ?? 0)}°</p>
                  </div>
                ))}
              </div>
            </Container>
          </div>

          <div className="flex gap-4">
            {/**Left  */}

            <Container className="w-fit justify-center flex-col px-4 items-center">
              <p className="capitalize text-center">
                {firstData?.weather[0].description}
              </p>

              <WeatherIcon
                iconName={getDayOrNightIcon(
                  firstData?.weather[0].icon ?? "",
                  firstData?.dt_txt ?? ""
                )}
              />
            </Container>

            {/**Right */}
            <Container className="bg-black/40 px-6 gap-4 justify-between overflow-x-auto">
              <WeatherDetails
                visibility={metersToMiles(firstData?.visibility ?? 10000)}
                airPressure={`${firstData?.main.pressure} hPa`}
                humidity={`${firstData?.main.humidity}%`}
                windSpeed={convertWindSpeed(firstData?.wind.speed ?? 0)}
                sunrise={format(fromUnixTime(data?.city.sunrise ?? 0), "H:mm")}
                sunset={format(fromUnixTime(data?.city.sunset ?? 0), "H:mm")}
              />
            </Container>
          </div>
        </section>

        {/** 7 day forecast data */}
        <section className="flex w-full flex-col gap-4">
          <p className="text-2xl">Weekly Forecast</p>
          {firstDataForEachDate.map((d, i) => (
            <ForecastWeatherDetail
              key={i}
              description={d?.weather[0].description ?? ""}
              weatherIcon={d?.weather[0].icon ?? "01d"}
              date={d ? format(parseISO(d.dt_txt), "dd.MM") : ""}
              day={d ? format(parseISO(d.dt_txt), "EEEE") : ""}
              feels_like={d?.main.feels_like ?? 0}
              temp={d?.main.temp ?? 0}
              temp_max={d?.main.temp_max ?? 0}
              temp_min={d?.main.temp_min ?? 0}
              airPressure={`${d?.main.pressure ?? ""} hPa `}
              humidity={`${d?.main.humidity ?? ""}% `}
              sunrise={format(
                fromUnixTime(data?.city.sunrise ?? 1702517657),
                "H:mm"
              )}
              sunset={format(
                fromUnixTime(data?.city.sunset ?? 1702517657),
                "H:mm"
              )}
              visibility={`${metersToMiles(d?.visibility ?? 10000)} `}
              windSpeed={`${convertWindSpeed(d?.wind.speed ?? 1.64)} `}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
