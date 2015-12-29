json.array!(@timesheets) do |timesheet|
  json.extract! timesheet, :id, :month, :year, :expected_hours
  json.url timesheet_url(timesheet, format: :json)
end
