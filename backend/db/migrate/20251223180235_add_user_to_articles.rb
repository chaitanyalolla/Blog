class AddUserToArticles < ActiveRecord::Migration[8.1]
  def change
    add_reference :articles, :user, foreign_key: true
  end
end
