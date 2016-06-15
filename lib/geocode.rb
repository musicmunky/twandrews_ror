class Geocode

	require 'net/http'
	require 'uri'

	attr_accessor :geocode_data
	attr_accessor :latitude
	attr_accessor :longitude
	attr_accessor :place_id


	def initialize
		self.geocode_data = {}
		self.latitude = 0
		self.longitude = 0
		self.place_id = ""
	end


	def setGeocodeData(hash)
		self.geocode_data = hash
	end


	def getGeocodeInfo(search)
		begin
			result = {}
			if search.to_s == ""
				raise "Invalid search string"
			end

			@g = Weather.where(service: "google").first
			url = @g.service_url
			key = @g.apikey
			if url == "" or key == ""
				raise "Invalid parameters set for Geocode object - please check value of Key and Url"
			end

			search = URI::encode(search)
			uri = URI("#{url}address=#{search}&key=#{key}")
			response = Net::HTTP.get_response(uri)

			if response.code.to_i == 200
				respjson = JSON.parse(response.body)
				result['status'] = respjson['status']
				result['code']   = response.code.to_i
				result['count']  = respjson['results'].size
				result['data']   = respjson['results']
				self.geocode_data = respjson['results']
			else
				raise "Error making request: STATUS CODE #{response.code}, ERROR: #{response.body}"
			end
		rescue => error
			result['status']	= "failure"
			result['message']	= "Error: #{error.message}"
			result['content']	= error.backtrace
		ensure
			return result
		end
	end

=begin
		public function loadGeoData($srch)
		{
			try {
				$url = $this->getApiUrl();
				$key = $this->getApiKey();
				if($srch == "")
				{
					throw new Exception("Invalid search string");
				}

				if($url == "" || $key == "")
				{
					throw new Exception("Invalid parameters set for Geocode object - please check value of Key and Url");
				}

				$search   = urlencode($srch);
				$requrl   = $url . "address=" . $search . "&key=" . $key;
				$content  = file_get_contents($requrl);
				$rescon   = json_decode($content, true);

				if(!isset($rescon['status']) || $rescon['status'] != "OK")
				{
					throw new Exception("Bad result from geocode server - please check parameters and try again");
				}

				$this->rescnt = count($rescon['results']);
				$this->geodat = $rescon['results'];
				$this->status = $rescon['status'];
			}
			catch(Exception $e){
				$this->status = "ERROR: " . $e->getMessage();
				$this->rescnt = -1;
				$this->geodat = array("ERROR" => $e->getMessage());
			}
		}
=end

end