class CreateResumes < ActiveRecord::Migration
  def change
    create_table :resumes do |t|
      t.text :summary
      t.text :education
      t.text :skills
      t.text :additional_info

      t.timestamps null: false
    end
  end
end
