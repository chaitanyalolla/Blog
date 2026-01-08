require "test_helper"

module Api
	module V1
		class AuthenticationControllerTest < ActionDispatch::IntegrationTest
			def setup
				@user_params = {
					user: {
						email: "newuser@example.com",
						name: "New User",
						password: "password123"
					}
				}
			end

			def json_response
				JSON.parse(response.body)
			end

			# Register Tests
			test "should register new user successfully" do
				assert_difference('User.count', 1) do
					post "/api/v1/auth/register", params: @user_params, as: :json
				end

				assert_response :created
				assert_not_nil json_response['token']
				assert_equal "newuser@example.com", json_response['user']['email']
				assert_equal "New User", json_response['user']['name']
				assert_not_nil json_response['user']['id']
			end

			test "should not register user with duplicate email" do
				User.create!(email: "newuser@example.com", name: "Existing", password: "password")

				assert_no_difference('User.count') do
					post "/api/v1/auth/register", params: @user_params, as: :json
				end

				assert_response :unprocessable_entity
				assert_includes json_response['errors'].join, "Email has already been taken"
			end

			test "should not register user without email" do
				@user_params[:user].delete(:email)

				post "/api/v1/auth/register", params: @user_params, as: :json

				assert_response :unprocessable_entity
				assert json_response['errors'].any? { |e| e.include?("Email") }
			end

			test "should not register user without name" do
				@user_params[:user].delete(:name)

				post "/api/v1/auth/register", params: @user_params, as: :json

				assert_response :unprocessable_entity
				assert json_response['errors'].any? { |e| e.include?("Name") }
			end

			test "should not register user without password" do
				@user_params[:user].delete(:password)

				post "/api/v1/auth/register", params: @user_params, as: :json

				assert_response :unprocessable_entity
				assert json_response['errors'].any? { |e| e.include?("Password") }
			end

			# Login Tests
			test "should login user with valid credentials" do
				user = User.create!(email: "test@example.com", name: "Test", password: "password123")

				post "/api/v1/auth/login", params: {
					user: { email: "test@example.com", password: "password123" }
				}, as: :json

				assert_response :ok
				assert_not_nil json_response['token']
				assert_equal user.id, json_response['user']['id']
				assert_equal user.email, json_response['user']['email']
				assert_equal user.name, json_response['user']['name']
			end

			test "should not login with invalid password" do
				User.create!(email: "test@example.com", name: "Test", password: "password123")

				post "/api/v1/auth/login", params: {
					user: { email: "test@example.com", password: "wrongpassword" }
				}, as: :json

				assert_response :unauthorized
				assert_equal "Invalid email or password", json_response['error']
			end

			test "should not login with non-existent email" do
				post "/api/v1/auth/login", params: {
					user: { email: "nonexistent@example.com", password: "password123" }
				}, as: :json

				assert_response :unauthorized
				assert_equal "Invalid email or password", json_response['error']
			end

			# Token Tests
			test "should generate valid JWT token on register" do
				post "/api/v1/auth/register", params: @user_params, as: :json

				assert_response :created
				token = json_response['token']
				decoded = JsonWebToken.decode(token)

				assert_not_nil decoded
				assert_not_nil decoded[:user_id]
				assert_not_nil decoded[:exp]
			end

			test "should generate valid JWT token on login" do
				User.create!(email: "test@example.com", name: "Test", password: "password123")

				post "/api/v1/auth/login", params: {
					user: { email: "test@example.com", password: "password123" }
				}, as: :json

				assert_response :ok
				token = json_response['token']
				decoded = JsonWebToken.decode(token)

				assert_not_nil decoded
				assert_not_nil decoded[:user_id]
				assert_not_nil decoded[:exp]
			end
		end
	end
end
