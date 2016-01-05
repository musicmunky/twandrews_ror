class ResumeEntriesController < ApplicationController
  before_action :set_resume_entry, only: [:show, :edit, :update, :destroy]

  # GET /resume_entries
  # GET /resume_entries.json
  def index
    @resume_entries = ResumeEntry.all
  end

  # GET /resume_entries/1
  # GET /resume_entries/1.json
  def show
  end

  # GET /resume_entries/new
  def new
    @resume_entry = ResumeEntry.new
  end

  # GET /resume_entries/1/edit
  def edit
  end

  # POST /resume_entries
  # POST /resume_entries.json
  def create
    @resume_entry = ResumeEntry.new(resume_entry_params)

    respond_to do |format|
      if @resume_entry.save
        format.html { redirect_to @resume_entry, notice: 'Resume entry was successfully created.' }
        format.json { render :show, status: :created, location: @resume_entry }
      else
        format.html { render :new }
        format.json { render json: @resume_entry.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /resume_entries/1
  # PATCH/PUT /resume_entries/1.json
  def update
    respond_to do |format|
      if @resume_entry.update(resume_entry_params)
        format.html { redirect_to @resume_entry, notice: 'Resume entry was successfully updated.' }
        format.json { render :show, status: :ok, location: @resume_entry }
      else
        format.html { render :edit }
        format.json { render json: @resume_entry.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /resume_entries/1
  # DELETE /resume_entries/1.json
  def destroy
    @resume_entry.destroy
    respond_to do |format|
      format.html { redirect_to resume_entries_url, notice: 'Resume entry was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_resume_entry
      @resume_entry = ResumeEntry.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def resume_entry_params
      params.require(:resume_entry).permit(:position, :company, :company_url, :description, :start_date, :end_date)
    end
end
