json.array!(@projects) do |project|
  json.extract! project, :id, :name, :link, :status, :description
  json.url project_url(project, format: :json)
end
