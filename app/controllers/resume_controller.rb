class ResumeController < ApplicationController
  def index
    @resume_entries = ResumeEntry.all
  end
end
