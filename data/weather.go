package data

import (
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
)

type WeatherAPI struct {
	RootUrl string
	ApiKey  string
}

var Weather = &WeatherAPI{
	RootUrl: "https://api.weatherapi.com/v1",
	ApiKey:  "3824de4dda654325aea05430232312",
}

type WeatherCondition struct {
	Text string  `json:"text"`
	Icon string  `json:"icon"`
	Code float32 `json:"code"`
}

type CurrentWeatherUpstreamResponse struct {
	FeelsLikeC float32          `json:"feelslike_c"`
	FeelsLikeF float32          `json:"feelslike_f"`
	Condition  WeatherCondition `json:"condition"`
	Cloud      float32          `json:"cloud"`
	GustMPH    float32          `json:"gust_mph"`
	GustKPH    float32          `json:"gust_kph"`
	Humidity   float32          `json:"humidity"`
	PrecipIn   float32          `json:"precip_in"`
	PrecipMM   float32          `json:"precip_mm"`
	PressureIn float32          `json:"pressure_in"`
	PressureMb float32          `json:"pressure_mb"`
	TempC      float32          `json:"temp_c"`
	TempF      float32          `json:"temp_f"`
	UV         float32          `json:"uv"`
	VisKM      float32          `json:"vis_km"`
	VisMiles   float32          `json:"vis_miles"`
	WindDegree float32          `json:"wind_degree"`
	WindKPH    float32          `json:"wind_kph"`
	WindMPH    float32          `json:"wind_mph"`
	WindDir    string           `json:"wind_dir"`
}

type AstroCondition struct {
	Sunrise      string  `json:"sunrise"`
	Sunset       string  `json:"sunset"`
	IsSunUp      float32 `json:"is_sun_up"`
	Moonrise     string  `json:"moonrise"`
	Moonset      string  `json:"moonset"`
	MoonPhase    string  `json:"moon_phase"`
	Illumination float32 `json:"moon_illumination"`
}

type DayWeatherUpstreamResponse struct {
	Condition     WeatherCondition `json:"condition"`
	AvgHumidity   float32          `json:"avghumidity"`
	AvgTempC      float32          `json:"avgtemp_c"`
	AvgTempF      float32          `json:"avgtemp_f"`
	AvgVisKM      float32          `json:"avgvis_km"`
	AvgVisMiles   float32          `json:"avgvis_miles"`
	MinTempC      float32          `json:"mintemp_c"`
	MinTempF      float32          `json:"mintemp_f"`
	MaxTempC      float32          `json:"maxtemp_c"`
	MaxTempF      float32          `json:"maxtemp_f"`
	WillItSnow    float32          `json:"daily_will_it_snow"`
	WillItRain    float32          `json:"daily_will_it_rain"`
	WindChillC    float32          `json:"windchill_c"`
	ChanceOfRain  float32          `json:"daily_chance_of_rain"`
	ChanceOfSnow  float32          `json:"daily_chance_of_snow"`
	TotalPrecipIn float32          `json:"totalprecip_in"`
	TotalPrecipMM float32          `json:"totalprecip_mm"`
	TotalSnowCM   float32          `json:"totalsnow_cm"`
	UV            float32          `json:"uv"`
}

type HourWeatherUpstreamResponse struct {
	TimeEpoch int    `json:"time_epoch"`
	Time      string `json:"time"`

	TempC      float32 `json:"temp_c"`
	TempF      float32 `json:"temp_f"`
	WindChillC float32 `json:"windchill_c"`
	WindChillF float32 `json:"windchill_f"`

	Condition WeatherCondition `json:"condition"`
}

type ForecastUpstreamResponse struct {
	Astro AstroCondition                `json:"astro"`
	Day   DayWeatherUpstreamResponse    `json:"day"`
	Hour  []HourWeatherUpstreamResponse `json:"hour"`
}

type ForecastQueryUpstreamResponse struct {
	Current  CurrentWeatherUpstreamResponse `json:"current"`
	Forecast struct {
		ForecastDay []ForecastUpstreamResponse `json:"forecastday"`
	} `json:"forecast"`
}

func (weather *WeatherAPI) TodaysForecast(query string) (*ForecastQueryUpstreamResponse, error) {
	url := fmt.Sprintf(
		"%s/forecast.json?q=%s&key=%s",
		weather.RootUrl,
		query,
		weather.ApiKey,
	)

	resp, err := http.Get(url)
	if err != nil {
		fmt.Println("No response from request")
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body) // response body is []byte

	if err != nil {
		return &ForecastQueryUpstreamResponse{}, err
	}

	response := ForecastQueryUpstreamResponse{}
	slog.Info("Help", slog.String("body", string(body)))
	err = json.Unmarshal(body, &response)

	if err != nil {
		return &ForecastQueryUpstreamResponse{}, err
	}

	return &response, nil
}
