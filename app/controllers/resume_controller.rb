class ResumeController < ApplicationController
  def index
    @resume_entries = ResumeEntry.all.order("start_date DESC, end_date DESC")
  end
end
