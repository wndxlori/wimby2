class FieldsController < ApplicationController
  # GET /fields
  # GET /fields.json
  def index
    options = {:select=> "latitude as lt, longitude as lg, province_state as pv, field_name as nm"}
    @fields = FieldLocation.all(options)
    respond_to do |format|
#      format.html # index.html.erb
      format.json { render json: @fields }
    end
  end
end