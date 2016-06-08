class ToolsController < ApplicationController
	before_action :set_tool, only: [:show, :edit, :update, :destroy]

	# GET /tools
	# GET /tools.json
	def index
		@tools = Tool.all
	end

	# GET /tools/1
	# GET /tools/1.json
	def show
	end

	# GET /tools/new
	def new
		@tool = Tool.new
	end

	# GET /tools/1/edit
	def edit
	end


	# POST /tools/1/addEditTool
	def addEditTool
		tid = params[:item_id]

		response = {}
		content  = {}
		status   = ""
		message  = ""

		begin
			new_or_edit = "new"
			update_success = false
			tool_params = { :name => params['name'], :link => params['link'], :description => params['description']}
			if tid.to_i == 0 # new tool
				@tool = Tool.new(tool_params)
				update_success = @tool.save
			else
				new_or_edit = "edit"
				@tool = Tool.find(tid.to_i)
				update_success = @tool.update(tool_params)
			end

			status = update_success ? "success" : "failure"
			message = update_success ? "Tool updated successfully!" : "Error during tool update"
			content['project'] = @tool.attributes
			content['type'] = "tool"
			content['new_or_edit'] = new_or_edit

			response['status'] = "success"
			response['message'] = "Returning data for #{@tool.name}"
			response['content'] = content
		rescue => error
			response['status'] = "failure"
			response['message'] = "Error: #{error.message}"
			response['content'] = error.backtrace
		ensure
			respond_to do |format|
				format.html { render :json => response.to_json }
			end
		end
	end


	def getToolInfo

		pid = params[:item_id]

		response = {}
		content  = {}
		status   = ""
		message  = ""

		begin
			@tool = Tool.find(pid.to_i)
			tool = @tool.attributes
			content['type'] = "tool"
			content['project'] = tool

			response['status'] = "success"
			response['message'] = "Returning data for tool #{@tool.name}"
			response['content'] = content

		rescue => error
			response['status'] = "failure"
			response['message'] = "Error: #{error.message}"
			response['content'] = error.backtrace
		ensure
			respond_to do |format|
				format.html { render :json => response.to_json }
			end
		end

	end


	# POST /tools
	# POST /tools.json
	def create
		@tool = Tool.new(tool_params)

		respond_to do |format|
			if @tool.save
				format.html { redirect_to tools_url, notice: 'Tool was successfully created.' }
				format.json { render :show, status: :created, location: @tool }
			else
				format.html { render :new }
				format.json { render json: @tool.errors, status: :unprocessable_entity }
			end
		end
	end

	# PATCH/PUT /tools/1
	# PATCH/PUT /tools/1.json
	def update
		respond_to do |format|
			if @tool.update(tool_params)
				format.html { redirect_to tools_url, notice: 'Tool was successfully updated.' }
				format.json { render :show, status: :ok, location: @tool }
			else
				format.html { render :edit }
				format.json { render json: @tool.errors, status: :unprocessable_entity }
			end
		end
	end

	# DELETE /tools/1
	# DELETE /tools/1.json
	def destroy
		@tool.destroy
		respond_to do |format|
			format.html { redirect_to tools_url, notice: 'Tool was successfully destroyed.' }
			format.json { head :no_content }
		end
	end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_tool
      @tool = Tool.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def tool_params
      params.require(:tool).permit(:name, :link, :description)
    end
end
