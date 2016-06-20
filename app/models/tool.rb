class Tool < ActiveRecord::Base

	def self.get_featured
		Tool.where(featured: true)
	end

end
