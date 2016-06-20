class CheckServer

require 'net/http'
require 'uri'
#require 'logger'

	def website_online?(site_url)
		begin
#			logger = ActiveSupport::TaggedLogging.new(Logger.new(STDOUT))
#			logger.tagged("CHECKSERVER") { logger.debug "Checking status of project (#{site_url}) by sending http request..." }

			up = false
			url = URI.parse(site_url)
			res = Net::HTTP.start(url.host, url.port) { |http| http.get('/') }

#			logger.tagged("CHECKSERVER") { logger.debug "Server responded with code #{res.code}" }

			code = res.code.to_i
			if code == 200 or code == 301 or code == 302
				up = true
			end
			return up
		rescue => error
#			logger.tagged("CHECKSERVER") { logger.debug "Error while checking server status: #{error.message}, Backtrace:\n#{error.backtrace}" }
			return false
		end
	end

end