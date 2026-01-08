module Authenticable
	extend ActiveSupport::Concern

	included do
		attr_reader :current_user
	end

	def authenticate_request!
		header = request.headers['Authorization']
		token = header.split(' ').last if header
		decoded = JsonWebToken.decode(token)
		if decoded
			@current_user = User.find(decoded[:user_id])
		else
			render json: { error: 'Unauthorized' }, status: :unauthorized
		end
	end
end