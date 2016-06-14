class GeoCode

require 'net/http'
require 'uri'

	def website_online?(site_url)
		begin
			up = false
			url = URI.parse(site_url)
			res = Net::HTTP.start(url.host, url.port) { |http| http.get('/') }
			code = res.code.to_i
			if code == 200 or code == 302 or code == 301
				up = true
			end
			return up
		rescue
			return false
		end
	end

end