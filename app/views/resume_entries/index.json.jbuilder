json.array!(@resume_entries) do |resume_entry|
  json.extract! resume_entry, :id, :position, :company, :company_url, :description, :start_date, :end_date
  json.url resume_entry_url(resume_entry, format: :json)
end
