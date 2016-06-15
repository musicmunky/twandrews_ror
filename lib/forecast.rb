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

				result['num_reqs']  = headinfo['x-forecast-api-calls'][0].to_i
				result['status']    = "success"
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
end

=begin
public function loadForecastData($latitude, $longitude, $timestamp = false, $exclusions = "minutely")
{
	try {
		if (!in_array($this->units, $this->validunits))
		{
			throw new Exception("Invalid units given: " . $this->units);
		}

		$url = $this->getApiUrl();
		$key = $this->getApiKey();
		if(!in_array($this->units, $this->validunits))
		{
			throw new Exception("Invalid unit parameter");
		}

		if($url == "" || $key == "")
		{
			throw new Exception("Invalid parameters set for Forecast object - please check value of Key and Url");
		}

		//setup the standard url
		$requrl  = $this->apiurl . $this->apikey . "/" . $latitude . "," . $longitude;
		//append the timestamp if available
		$requrl .= $timestamp ? "," . $timestamp : "";
		//set the units and the language
		$requrl .= "?units=" . $this->units . "&lang=" . $this->language;
		//append the exclusions if applicable
		$requrl .= $exclusions ? "&exclude=" . $exclusions : "";

		$content = file_get_contents($requrl);
		$rsltcon = json_decode($content, true);

		$reqstat = explode(" ", $http_response_header[0]);

		if(!isset($reqstat[1]) || $reqstat[1] != "200")
		{
			throw new Exception("Bad result from forecast server - please check parameters and try again");
		}

		//initialize number of requests to 0, just in case they change the key for the number of API calls
		$this->setNumReqs();
		for($i = 0; $i < count($http_response_header); $i++) {
			if(preg_match('/^x-forecast-api-calls:\s?\d{1,}$/i', $http_response_header[$i])) {
				$numreqs = explode(" ", $http_response_header[$i]);
				$this->setNumReqs($numreqs[1]);
				break;
			}
		}

		$this->fordat = $rsltcon;
		$this->status = $reqstat[1];
	}
	catch(Exception $e){
		$this->status = "ERROR: " . $e->getMessage();
		$this->setNumReqs(-1);
		$this->fordat = array("ERROR" => $e->getMessage());
	}
}
=end