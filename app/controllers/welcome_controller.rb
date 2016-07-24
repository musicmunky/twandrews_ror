class WelcomeController < ApplicationController
	layout "jumbotron"

	def index
		require "addressable/uri"

		@referrer = request.referrer
		@aHostInfo = []
		@oHost = {}
		@sHost = ""
		if !@referrer.nil? and @referrer.size > 10
			@oHost = Addressable::URI.parse(@referrer)
			@oHost.normalize
			@aHostInfo = @oHost.host.split(".")
			if @aHostInfo[0] == "www"
				@aHostInfo.shift
			end
			@sHost = @aHostInfo.join(".")
		end
	end
end
