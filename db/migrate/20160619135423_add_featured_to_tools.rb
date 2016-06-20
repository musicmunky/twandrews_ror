class AddFeaturedToTools < ActiveRecord::Migration
	def change
		add_column :tools, :featured, :boolean, :default => false
	end
end
