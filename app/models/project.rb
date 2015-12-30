class Project < ActiveRecord::Base

	def get_status
		self.status.split("_").join(" ").titleize
	end

end
