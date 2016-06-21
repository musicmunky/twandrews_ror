module ApplicationHelper
	# Quick way to automate pretty page titles.
	def view_title(page_title)
		content_for(:title) { page_title }
	end

	# Quick way to highlight active navigation bar areas.
	def is_active(controller)
		act = nil
		begin
			if params[:controller] == controller or params[:controller] == "#{controller}s"
				act = "active"
			end
		rescue
		end
		return act
	end
end
