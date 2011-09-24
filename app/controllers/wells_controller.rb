class WellsController < ApplicationController

  def map
    render layout: 'map'
  end

  # GET /wells
  # GET /wells.json
  def index
    regions = {"1" => {:n => "60.0", :s =>"49.0", :e =>"-80.0", :w =>"-125.0"}}

    @wells = Well.find_for_web_map({:regions => regions})
#    @wells = Well.find_for_web_map({:regions => regions, :clustered => "true", :scale => {:h => '2883', :v => '2195'}})

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
