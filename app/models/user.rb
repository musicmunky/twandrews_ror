class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
	devise :database_authenticatable, :registerable,
			:rememberable, :trackable, :validatable #:recoverable,

#	def active_for_authentication?
#		super && !self.archive # i.e. super && self.is_active
#	end

	def inactive_message
		"Sorry, this account has been disabled - please contact your administrator"
	end

	def get_name
		fullname = "#{self.first_name} #{self.last_name}"
	end

	def get_first_name
		self.first_name
	end
end
