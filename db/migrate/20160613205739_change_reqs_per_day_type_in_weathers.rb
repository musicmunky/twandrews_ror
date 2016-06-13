class ChangeReqsPerDayTypeInWeathers < ActiveRecord::Migration
  def change
	  change_column :weathers, :reqs_per_day, :integer
  end
end
