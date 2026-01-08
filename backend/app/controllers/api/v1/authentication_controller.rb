module Api
	module V1
		class AuthenticationController < ApplicationController
			protect_from_forgery with: :null_session

			# POST /api/v1/auth/register
			def register
				@user = User.new(register_params)

				if @user.save
					token = generate_token(@user)
					render json: {
						token: token,
						user: user_response(@user)
					}, status: :created
				else
					render json: {
						errors: @user.errors.full_messages
					}, status: :unprocessable_entity
				end
			end

			# POST /api/v1/auth/login
			def login
				@user = User.find_by(email: login_params[:email])

				if @user&.authenticate(login_params[:password])
					token = generate_token(@user)
					render json: {
						token: token,
						user: user_response(@user)
					}, status: :ok
				else
					render json: {
						error: 'Invalid email or password'
					}, status: :unauthorized
				end
			end

			private

			def register_params
				params.require(:user).permit(:email, :name, :password)
			end

			def login_params
				params.require(:user).permit(:email, :password)
			end

			def generate_token(user)
				JsonWebToken.encode(user_id: user.id)
			end

			def user_response(user)
				{
					id: user.id,
					email: user.email,
					name: user.name
				}
			end
		end
	end
end
