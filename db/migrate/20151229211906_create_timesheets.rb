class CreateTimesheets < ActiveRecord::Migration
  def change
    create_table :timesheets do |t|
      t.string :month
      t.integer :year
      t.integer :expected_hours

      t.timestamps null: false
    end
  end
end
