json.array!(@tools) do |tool|
  json.extract! tool, :id, :name, :link, :description
  json.url tool_url(tool, format: :json)
end
