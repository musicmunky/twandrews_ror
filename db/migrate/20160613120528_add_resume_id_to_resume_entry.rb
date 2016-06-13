class AddResumeIdToResumeEntry < ActiveRecord::Migration
	def change
		add_column :resume_entries, :resume_id, :integer
	end
end
