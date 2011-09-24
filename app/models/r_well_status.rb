class RWellStatus < ActiveRecord::Base
  set_table_name :r_well_status
  set_primary_key :status

  has_many :wells, :foreign_key => :current_status
end
