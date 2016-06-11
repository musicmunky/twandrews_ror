class ProjectsController < ApplicationController
	before_action :set_project, only: [:show, :edit, :update, :destroy]
	require 'timeout'

	# GET /projects
	# GET /projects.json
	def index
		@cmp_projects = Project.where(status: "completed").order("id ASC")
		@dev_projects = Project.where(status: "in_development").order("id ASC")
		@tools = Tool.all
	end

	# GET /projects/1
	# GET /projects/1.json
	def show
	end

	# GET /projects/new
	def new
		@project = Project.new
	end

	# GET /projects/1/edit
	def edit
	end


	# POST /projects/1/addEditProject
	def addEditProject
		require 'checkserver'

		pid = params[:item_id]
		response = {}
		content  = {}
		status   = ""
		message  = ""

		begin
			new_or_edit = "new"
			update_success = false
			project_params = { :name => params['name'], :link => params['link'], :status => params['status'], :description => params['description']}
			content['old_status'] = ""
			content['new_status'] = ""

			if pid.to_i == 0 # new project
				@project = Project.new(project_params)
				update_success = @project.save
			else
				new_or_edit = "edit"
				@project = Project.find(pid.to_i)
				content['old_status'] = @project.status
				content['new_status'] = params['status']
				update_success = @project.update(project_params)
			end

			@chkserver = CheckServer.new
			up_down = false
			begin
				up_down = Timeout::timeout(3) { @chkserver.website_online?(@project.link) }
			rescue
			end

			status = update_success ? "success" : "failure"
			message = update_success ? "Project updated successfully!" : "Error during project update"
			content['project'] = @project.attributes
			content['type'] = "project"
			content['new_or_edit'] = new_or_edit
			content['up_or_down'] = up_down

			response['status'] = "success"
			response['message'] = "Returning data for #{@project.name}"
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


	def getProjectInfo
		pid = params[:item_id]

		response = {}
		content  = {}
		status   = ""
		message  = ""

		begin
			@proj = Project.find(pid.to_i)
			project = @proj.attributes
			content['type'] = "project"
			content['project'] = project

			response['status'] = "success"
			response['message'] = "Returning data for project #{@proj.name}"
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


	def checkAppStatus
		require 'checkserver'
		@chkserver = CheckServer.new

		response = {}
		content  = {}
		status   = ""
		message  = ""

		begin
			projects = {}
			Project.all.each do |project|
				up_down = false
				begin
					up_down = Timeout::timeout(3) { @chkserver.website_online?(project.link) }
				rescue
				end
				projects[project.id] = up_down
			end
			content['projects'] = projects

			response['status']  = "success"
			response['message'] = "Returning server data for all projects"
			response['content'] = content
		rescue => error
			response['status']  = "failure"
			response['message'] = "Error: #{error.message}"
			response['content'] = error.backtrace
		ensure
			respond_to do |format|
				format.html { render :json => response.to_json }
			end
		end
	end


	def deleteProject
		pid = params[:item_id]

		response = {}
		content  = {}
		status   = ""
		message  = ""

		begin
			@proj = Project.find(pid.to_i)
			project = @proj.attributes
			content['type'] = "project"
			content['project'] = project
			@proj.destroy

			response['status'] = "success"
			response['message'] = "Successfully deleted project #{project['name']}"
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


	# POST /projects
	# POST /projects.json
	def create
		@project = Project.new(project_params)

		respond_to do |format|
			if @project.save
				format.html { redirect_to projects_url, notice: 'Project was successfully created.' }
				format.json { render :show, status: :created, location: @project }
			else
				format.html { render :new }
				format.json { render json: @project.errors, status: :unprocessable_entity }
			end
		end
	end

	# PATCH/PUT /projects/1
	# PATCH/PUT /projects/1.json
	def update
		respond_to do |format|
			if @project.update(project_params)
				format.html { redirect_to projects_url, notice: 'Project was successfully updated.' }
				format.json { render :show, status: :ok, location: @project }
			else
				format.html { render :edit }
				format.json { render json: @project.errors, status: :unprocessable_entity }
			end
		end
	end

	# DELETE /projects/1
	# DELETE /projects/1.json
	def destroy
		@project.destroy
		respond_to do |format|
			format.html { redirect_to projects_url, notice: 'Project was successfully destroyed.' }
			format.json { head :no_content }
		end
	end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_project
      @project = Project.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def project_params
      params.require(:project).permit(:name, :link, :status, :description)
    end
end
