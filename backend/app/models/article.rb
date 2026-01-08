class Article < ApplicationRecord
	validates :title, presence: true
	validates :body, presence: true, length: { minimum: 10 }

	scope :published, -> {where(published: true)}
end
