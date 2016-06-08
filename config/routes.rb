Rails.application.routes.draw do


  resources :resume_entries
	resources :timesheets
	devise_for :users, :controllers => { registrations: 'registrations' }

	resources :tools do
		member do
			get "getToolInfo"
			post "addEditTool"
		end
	end

	resources :projects do
		member do
			get "getProjectInfo"
			get "checkAppStatus"
			post "addEditProject"
		end
	end

	get 'about', to: 'about#index', as: :about
	get 'about/index'

	get 'resume', to: 'resume#index', as: :resume
	get 'resume/index'

	root to: 'welcome#index'
	get 'welcome/index'


	# this is the catch-all route for pages that people might reach in error,
	# and will redirect them back to the index page.
	match '*', via: :all, to: 'welcome#index'

end
