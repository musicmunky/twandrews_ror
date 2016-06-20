class Project < ActiveRecord::Base

	def get_status
		self.status.split("_").join(" ").titleize
	end

	def self.get_featured
		Project.where(featured: true)
	end

end
