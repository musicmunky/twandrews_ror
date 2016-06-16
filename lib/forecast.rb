class Forecast

	require 'net/http'
	require 'uri'

	@@validunits = ['auto', 'us', 'si', 'ca', 'uk']

	def self.getForecastData(latitude, longitude, options={})
		begin
			result = {}
			options = {units: "us", language: "en", timestamp: "", exclusions: "minutely"}.merge(options)

			if latitude.to_s == "" or longitude.to_s == ""
				raise "Invalid latitude and longitude values"
			end

			if @@validunits.find_index(options[:units]).nil?
				raise "Invalid units specified"
			end

			option_str = "";
			option_str += (options[:timestamp].to_s != "") ? ",#{options[:timestamp]}" : ""
			option_str += "?units=#{options[:units]}&lang=#{options[:language]}"
			option_str += (options[:exclusions].to_s != "") ? "&exclude=#{options[:exclusions]}" : "";

			@f = Weather.where(service: "forecast").first
			url = @f.service_url
			key = @f.apikey
			rqs = @f.reqs_per_day

			if url == "" or key == ""
				raise "Invalid parameters set for Geocode object - please check value of Key and Url"
			end

			uri = URI("#{url}#{key}/#{latitude},#{longitude}#{option_str}")
			response = Net::HTTP.get_response(uri)

			if response.code.to_i == 200
				respjson = JSON.parse(response.body)
				headinfo = JSON.parse(response.to_json)

				result['status']    = "success"
				result['num_reqs']  = headinfo['x-forecast-api-calls'][0].to_i
				result['code']      = response.code.to_i
				result['hourly']    = respjson['hourly']['data'][1..8]
				result['daily']     = respjson['daily']['data'][0..5]
				result['current']   = respjson['currently']
				result['timezone']  = respjson['timezone']
				result['tz_offset'] = respjson['offset']
			else
				raise "Error making request: STATUS CODE #{response.code}, ERROR: #{response.body}"
			end
		rescue => error
			result['status']  = "failure"
			result['message'] = "Error: #{error.message}"
			result['content'] = error.backtrace
		ensure
			return result
		end

	end

	def self.valid_units
		@@validunits
	end
end
