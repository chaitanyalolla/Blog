module Api
	module V1
		class ArticlesController < ApplicationController
			protect_from_forgery with: :null_session

			include Authenticable
			before_action :authenticate_request!

			def index
				@articles = @current_user.articles.order(created_at: :desc)
				render json: @articles
			end

			def show
				@article = Article.find(params[:id])
				render json: @article
			rescue ActiveRecord::RecordNotFound
				render json: { error: 'Article not found' }, status: :not_found
			end

			def create
				@article = @current_user.articles.build(article_params)
				if @article.save
					render json: @article, status: :created
				else
					render json: { errors: @article.errors.full_messages },
					status: :unprocessable_entity
				end
			end

			def update
				@article = @current_user.articles.find(params[:id])
				if @article.update(article_params)
					render json: @article
				else
					render json: { errors: @article.errors.full_messages },
					status: :unprocessable_entity
				end
			rescue ActiveRecord::RecordNotFound
				render json: { error: 'Article not found' }, status: :not_found
			end

			def destroy
				@article = @current_user.articles.find(params[:id])
				@article.destroy
				head :no_content
			rescue ActiveRecord::RecordNotFound
				render json: { error: 'Article not found' }, status: :not_found
			end

			private
			
			def article_params
				params.require(:article).permit(:title, :body, :published)
			end
		end
	end
end