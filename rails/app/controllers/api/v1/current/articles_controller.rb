class Api::V1::Current::ArticlesController < Api::V1::BaseController
  before_action :authenticate_user!

  def create
    unsaved_article = current_user.articles.unsaved.first || current_user.articles.create!(status: :unsaved)
    render json: unsaved_article
  end
end
