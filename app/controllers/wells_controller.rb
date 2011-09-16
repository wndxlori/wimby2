class WellsController < ApplicationController

  def map
    render layout: 'map'
  end

  # GET /wells
  # GET /wells.json
  def index
    @wells = Well.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @wells }
    end
  end

  # GET /wells/1
  # GET /wells/1.json
  def show
    @well = Well.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @well }
    end
  end
end
