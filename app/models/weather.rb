class Weather < ActiveRecord::Base

	require 'forecast'
	require 'geocode'

	def self.getWeatherForecast
		f = Forecast.getForecastInfo
		g = Geocode.getGeocodeInfo

		puts "F IS: #{f}  G IS: #{g}"
	end


	def self.getWeather
		return "foo"
	end

end
