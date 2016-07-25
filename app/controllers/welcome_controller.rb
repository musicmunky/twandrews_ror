class WelcomeController < ApplicationController
	layout "jumbotron"

	def index
		require "addressable/uri"

		@referrer = request.referrer
		@aHostInfo = []
		@oHost = {}
		@sHost = ""

		begin
			@current_host = Addressable::URI.parse(root_url)
			if !@referrer.nil? and @referrer.size > 10
				@oHost = Addressable::URI.parse(@referrer)
				if @oHost.host != @current_host.host
					@oHost.normalize
					@aHostInfo = @oHost.host.split(".")
					if @aHostInfo[0] == "www"
						@aHostInfo.shift
					end
					@sHost = @aHostInfo.join(".")
				end
			end
		rescue
		end
	end
end
