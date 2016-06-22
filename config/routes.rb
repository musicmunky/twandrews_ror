Rails.application.routes.draw do

	resources :resume_entries
	resources :timesheets

	devise_for :users, :controllers => { registrations: 'registrations' }

	devise_scope :user do
		get 'login', to: 'devise/sessions#new'
	end

	resources :tools do
		member do
			get "getToolInfo"
			post "deleteTool"
			post "addEditTool"
			post "updateFeaturedTool"
		end
	end

	resources :projects do
		member do
			get "getProjectInfo"
			get "checkAppStatus"
			post "deleteProject"
			post "addEditProject"
			post "updateFeaturedProject"
		end
	end

	get 'weather', to: 'weathers#index', as: :weather

	get 'resume', to: 'resumes#index', as: :resume
	resources :resumes

	resources :weathers do
		member do
			get "getForecastSearch"
			get "getForecastLatLong"
		end
	end

	get 'about', to: 'about#index', as: :about
	get 'about/index'

	root to: 'welcome#index'
	get 'welcome/index'


	# this is the catch-all route for pages that people might reach in error,
	# and will redirect them back to the index page.
	match '*', via: :all, to: 'welcome#index'

end
