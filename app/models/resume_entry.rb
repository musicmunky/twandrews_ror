class ResumeEntry < ActiveRecord::Base

	def date_difference
		sd = self.start_date
		ed = self.is_current? ? Time.now : self.end_date
		months = (ed.year * 12 + ed.month) - (sd.year * 12 + sd.month)
		months.divmod(12)
	end

end
