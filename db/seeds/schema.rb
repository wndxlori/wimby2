# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20090915174107) do
  create_table "business_associate", :primary_key => "business_associate", :force => true do |t|
    t.string   "active_ind",           :limit => 3
    t.string   "ba_abbreviation",      :limit => 60
    t.string   "ba_category",          :limit => 60
    t.string   "ba_code",              :limit => 60
    t.string   "ba_name",              :limit => 720
    t.string   "ba_short_name",        :limit => 90
    t.string   "ba_type",              :limit => 90
    t.datetime "credit_check_date"
    t.string   "credit_check_ind",     :limit => 3
    t.string   "credit_check_source",  :limit => 60
    t.string   "credit_rating",        :limit => 60
    t.string   "credit_rating_source", :limit => 60
    t.string   "current_status",       :limit => 60
    t.datetime "effective_date"
    t.datetime "expiry_date"
    t.string   "first_name",           :limit => 90
    t.string   "last_name",            :limit => 120
    t.string   "main_email_address",   :limit => 60
    t.string   "main_fax_num",         :limit => 60
    t.string   "main_phone_num",       :limit => 60
    t.string   "main_web_url",         :limit => 60
    t.string   "middle_initial",       :limit => 9
    t.string   "ppdm_guid",            :limit => 114
    t.string   "remark",               :limit => 4000
    t.string   "source",               :limit => 60
    t.string   "row_changed_by",       :limit => 90
    t.datetime "row_changed_date"
    t.string   "row_created_by",       :limit => 90
    t.datetime "row_created_date"
    t.string   "row_quality",          :limit => 60
    t.string   "ba_group",             :limit => 60
  end

  create_table "r_well_status", :primary_key => "status", :force => true do |t|
    t.string   "status_type",      :limit => 60,   :null => false
    t.string   "abbreviation",     :limit => 36
    t.string   "active_ind",       :limit => 3
    t.datetime "effective_date"
    t.datetime "expiry_date"
    t.string   "long_name",        :limit => 180
    t.string   "ppdm_guid",        :limit => 114
    t.string   "remark",           :limit => 4000
    t.string   "short_name",       :limit => 90
    t.string   "source",           :limit => 60
    t.string   "status_group",     :limit => 60
    t.string   "row_changed_by",   :limit => 90
    t.datetime "row_changed_date"
    t.string   "row_created_by",   :limit => 90
    t.datetime "row_created_date"
    t.string   "row_quality",      :limit => 60
  end

  create_table "well", :primary_key => "uwi", :force => true do |t|
    t.datetime "abandonment_date"
    t.string   "active_ind",                :limit => 3
    t.string   "assigned_field",            :limit => 60
    t.string   "base_node_id",              :limit => 60
    t.decimal  "bottom_hole_latitude",                      :precision => 12, :scale => 7
    t.decimal  "bottom_hole_longitude",                     :precision => 12, :scale => 7
    t.decimal  "casing_flange_elev",                        :precision => 10, :scale => 5
    t.string   "casing_flange_elev_ouom",   :limit => 60
    t.datetime "completion_date"
    t.datetime "confidential_date"
    t.decimal  "confidential_depth",                        :precision => 10, :scale => 5
    t.string   "confidential_depth_ouom",   :limit => 60
    t.string   "confidential_type",         :limit => 60
    t.string   "confid_strat_name_set_id",  :limit => 60
    t.string   "confid_strat_unit_id",      :limit => 60
    t.string   "country",                   :limit => 60
    t.string   "county",                    :limit => 60
    t.string   "current_class",             :limit => 60
    t.string   "current_status",            :limit => 60
    t.datetime "current_status_date"
    t.decimal  "deepest_depth",                             :precision => 10, :scale => 5
    t.string   "deepest_depth_ouom",        :limit => 60
    t.string   "depth_datum",               :limit => 60
    t.decimal  "depth_datum_elev",                          :precision => 10, :scale => 5
    t.string   "depth_datum_elev_ouom",     :limit => 60
    t.decimal  "derrick_floor_elev",                        :precision => 10, :scale => 5
    t.string   "derrick_floor_elev_ouom",   :limit => 60
    t.decimal  "difference_lat_msl",                        :precision => 10, :scale => 5
    t.string   "discovery_ind",             :limit => 3
    t.string   "district",                  :limit => 60
    t.decimal  "drill_td",                                  :precision => 10, :scale => 5
    t.string   "drill_td_ouom",             :limit => 60
    t.datetime "effective_date"
    t.string   "elev_ref_datum",            :limit => 60
    t.datetime "expiry_date"
    t.string   "faulted_ind",               :limit => 3
    t.datetime "final_drill_date"
    t.decimal  "final_td",                                  :precision => 10, :scale => 5
    t.string   "final_td_ouom",             :limit => 60
    t.string   "geographic_region",         :limit => 60
    t.string   "geologic_province",         :limit => 60
    t.decimal  "ground_elev",                               :precision => 10, :scale => 5
    t.string   "ground_elev_ouom",          :limit => 60
    t.string   "ground_elev_type",          :limit => 60
    t.string   "initial_class",             :limit => 60
    t.decimal  "kb_elev",                                   :precision => 10, :scale => 5
    t.string   "kb_elev_ouom",              :limit => 60
    t.string   "lease_name",                :limit => 180
    t.string   "lease_num",                 :limit => 60
    t.string   "legal_survey_type",         :limit => 60
    t.string   "location_type",             :limit => 60
    t.decimal  "log_td",                                    :precision => 10, :scale => 5
    t.string   "log_td_ouom",               :limit => 60
    t.decimal  "max_tvd",                                   :precision => 10, :scale => 5
    t.string   "max_tvd_ouom",              :limit => 60
    t.integer  "net_pay",                   :limit => 6,    :precision => 6,  :scale => 0
    t.string   "net_pay_ouom",              :limit => 60
    t.integer  "oldest_strat_age",          :limit => 12,   :precision => 12, :scale => 0
    t.string   "oldest_strat_name_set_age", :limit => 60
    t.string   "oldest_strat_name_set_id",  :limit => 60
    t.string   "oldest_strat_unit_id",      :limit => 60
    t.string   "operator",                  :limit => 60
    t.string   "parent_relationship_type",  :limit => 60
    t.string   "parent_uwi",                :limit => 60
    t.string   "platform_id",               :limit => 60
    t.string   "platform_sf_type",          :limit => 72
    t.string   "plot_name",                 :limit => 60
    t.string   "plot_symbol",               :limit => 60
    t.decimal  "plugback_depth",                            :precision => 10, :scale => 5
    t.string   "plugback_depth_ouom",       :limit => 60
    t.string   "ppdm_guid",                 :limit => 114
    t.string   "primary_source",            :limit => 60
    t.string   "profile_type",              :limit => 60
    t.string   "province_state",            :limit => 60,                                  :null => false
    t.string   "regulatory_agency",         :limit => 60
    t.string   "remark",                    :limit => 4000
    t.datetime "rig_on_site_date"
    t.datetime "rig_release_date"
    t.decimal  "rotary_table_elev",                         :precision => 10, :scale => 5
    t.string   "source_document",           :limit => 60
    t.datetime "spud_date"
    t.string   "status_type",               :limit => 60
    t.string   "subsea_elev_ref_type",      :limit => 60
    t.decimal  "surface_latitude",                          :precision => 12, :scale => 7
    t.decimal  "surface_longitude",                         :precision => 12, :scale => 7
    t.string   "surface_node_id",           :limit => 60
    t.string   "tax_credit_code",           :limit => 60
    t.integer  "td_strat_age",              :limit => 12,   :precision => 12, :scale => 0
    t.string   "td_strat_name_set_age",     :limit => 60
    t.string   "td_strat_name_set_id",      :limit => 60
    t.string   "td_strat_unit_id",          :limit => 60
    t.decimal  "water_acoustic_vel",                        :precision => 10, :scale => 5
    t.string   "water_acoustic_vel_ouom",   :limit => 60
    t.decimal  "water_depth",                               :precision => 10, :scale => 5
    t.string   "water_depth_datum",         :limit => 60
    t.string   "water_depth_ouom",          :limit => 60
    t.string   "well_event_num",            :limit => 12
    t.string   "well_government_id",        :limit => 60
    t.decimal  "well_intersect_md",                         :precision => 10, :scale => 5
    t.string   "well_name",                 :limit => 198
    t.string   "well_num",                  :limit => 60
    t.integer  "well_numeric_id",           :limit => 12,   :precision => 12, :scale => 0
    t.decimal  "whipstock_depth",                           :precision => 10, :scale => 5
    t.string   "whipstock_depth_ouom",      :limit => 60
    t.string   "row_changed_by",            :limit => 90
    t.datetime "row_changed_date"
    t.string   "row_created_by",            :limit => 90
    t.datetime "row_created_date"
    t.string   "row_quality",               :limit => 60
    t.string   "x_current_licensee",        :limit => 60
    t.integer  "x_event_num",               :limit => 3,    :precision => 3,  :scale => 0
    t.integer  "x_event_num_max",           :limit => 3,    :precision => 3,  :scale => 0
    t.string   "x_offshore_ind",            :limit => 60
    t.datetime "x_onprod_date"
    t.datetime "x_oninject_date"
    t.string   "x_pool",                    :limit => 60
    t.string   "x_uwi_sort",                :limit => 60
    t.string   "x_uwi_display",             :limit => 72
    t.decimal  "x_td_tvd",                                  :precision => 10, :scale => 5
    t.decimal  "x_plugback_tvd",                            :precision => 10, :scale => 5
    t.decimal  "x_whipstock_tvd",                           :precision => 10, :scale => 5
    t.string   "x_original_status",         :limit => 60
    t.string   "x_original_unit",           :limit => 36
    t.string   "x_previous_status",         :limit => 60
    t.integer  "confid_strat_age",          :limit => 12,   :precision => 12, :scale => 0
    t.string   "x_surface_abandon_type",    :limit => 60
    t.string   "geog_coord_system_id",      :limit => 60
    t.string   "location_qualifier",        :limit => 60
    t.string   "x_confidential_period",     :limit => 60
    t.string   "x_primary_borehole_uwi",    :limit => 60
    t.string   "x_digital_log_ind",         :limit => 3
    t.string   "x_raster_log_ind",          :limit => 3
  end


  create_table "well_node", :primary_key => "node_id", :force => true do |t|
    t.string   "active_ind",         :limit => 3
    t.string   "coordinate_quality", :limit => 60
    t.string   "coord_system_id",    :limit => 60
    t.datetime "effective_date"
    t.datetime "expiry_date"
    t.decimal  "latitude",                           :precision => 12, :scale => 7
    t.string   "legal_survey_type",  :limit => 60
    t.string   "location_quality",   :limit => 60
    t.string   "location_type",      :limit => 60
    t.decimal  "longitude",                          :precision => 12, :scale => 7
    t.integer  "node_numeric_id",    :limit => 12,   :precision => 12, :scale => 0
    t.string   "node_position",      :limit => 60
    t.integer  "original_obs_no",    :limit => 8,    :precision => 8,  :scale => 0
    t.string   "original_xy_uom",    :limit => 60
    t.string   "platform_id",        :limit => 60
    t.string   "platform_sf_type",   :limit => 72
    t.string   "ppdm_guid",          :limit => 114
    t.string   "preferred_ind",      :limit => 3
    t.string   "remark",             :limit => 4000
    t.integer  "selected_obs_no",    :limit => 8,    :precision => 8,  :scale => 0
    t.string   "source",             :limit => 60
    t.string   "uwi",                :limit => 60
    t.string   "row_changed_by",     :limit => 90
    t.datetime "row_changed_date"
    t.string   "row_created_by",     :limit => 90
    t.datetime "row_created_date"
    t.string   "row_quality",        :limit => 60
  end

  add_foreign_key "well", "business_associate", :column => "operator", :name => "fk_well_operator"
  add_foreign_key "well", "r_well_status", :column => "current_status", :name => "fk_well_r_well_status"
  add_foreign_key "well", "well_node", :column => "surface_node_id", :name => "fk_well_surface_node"

end
