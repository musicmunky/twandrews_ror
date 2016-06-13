json.array!(@resumes) do |resume|
  json.extract! resume, :id, :summary, :education, :skills, :additional_info
  json.url resume_url(resume, format: :json)
end
