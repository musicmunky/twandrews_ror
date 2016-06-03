class AddIsCurrentToResumeEntries < ActiveRecord::Migration
  def change
    add_column :resume_entries, :is_current, :boolean, :default => false
  end
end
