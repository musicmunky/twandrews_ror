class WeathersController < ApplicationController

	layout "weather"
	require 'forecast'
	require 'geocode'


	def index
	end


	def getForecastSearch
		srch = params[:search]
		unit = params[:units]

		response = {}
		content  = {}
		status   = ""
		message  = ""

		begin
			geocode  = Geocode.new
			geodata  = geocode.getGeocodeInfo(srch)
			forecast = Forecast.getForecastData(geodata['data']['latitude'], geodata['data']['longitude'], {units: unit})

			if forecast['status'] != "success"
				raise "Error fetching forecast: #{forecast['message']}\nBacktrace: #{forecast['content']}"
			end

			content['geodata'] = geodata
			content['forecast'] = forecast

			response['status'] = "success"
			response['message'] = "Returning forecast data for search #{params[:search]}"
			response['content'] = content
		rescue => error
			response['status'] = "failure"
			response['message'] = "Error: #{error.message}"
			response['content'] = error.backtrace
		ensure
			respond_to do |format|
				format.html { render :json => response.to_json }
			end
		end
	end


	def getForecastLatLong
		unit    = params[:units]
		geodata = params[:geoinfo]

		response = {}
		content  = {}
		status   = ""
		message  = ""

		begin
			forecast = Forecast.getForecastData(geodata['latitude'], geodata['longitude'], {units: unit})

			content['geodata'] = { "data" => geodata }
			content['forecast'] = forecast

			response['status'] = "success"
			response['message'] = "Returning forecast data for search #{params[:search]}"
			response['content'] = content
		rescue => error
			response['status'] = "failure"
			response['message'] = "Error: #{error.message}"
			response['content'] = error.backtrace
		ensure
			respond_to do |format|
				format.html { render :json => response.to_json }
			end
		end
	end


end
