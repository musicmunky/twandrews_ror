class Resume < ActiveRecord::Base

	belongs_to :user
	has_many :resume_entries

end
