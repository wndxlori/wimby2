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

ActiveRecord::Schema.define(:version => 0) do

  create_table "business_associate", :id => false, :force => true do |t|
    t.string   "BUSINESS_ASSOCIATE",   :limit => 60,   :null => false
    t.string   "ACTIVE_IND",           :limit => 3
    t.string   "BA_ABBREVIATION",      :limit => 60
    t.string   "BA_CATEGORY",          :limit => 60
    t.string   "BA_CODE",              :limit => 60
    t.string   "BA_NAME",              :limit => 720
    t.string   "BA_SHORT_NAME",        :limit => 90
    t.string   "BA_TYPE",              :limit => 90
    t.datetime "CREDIT_CHECK_DATE"
    t.string   "CREDIT_CHECK_IND",     :limit => 3
    t.string   "CREDIT_CHECK_SOURCE",  :limit => 60
    t.string   "CREDIT_RATING",        :limit => 60
    t.string   "CREDIT_RATING_SOURCE", :limit => 60
    t.string   "CURRENT_STATUS",       :limit => 60
    t.datetime "EFFECTIVE_DATE"
    t.datetime "EXPIRY_DATE"
    t.string   "FIRST_NAME",           :limit => 90
    t.string   "LAST_NAME",            :limit => 120
    t.string   "MAIN_EMAIL_ADDRESS",   :limit => 60
    t.string   "MAIN_FAX_NUM",         :limit => 60
    t.string   "MAIN_PHONE_NUM",       :limit => 60
    t.string   "MAIN_WEB_URL",         :limit => 60
    t.string   "MIDDLE_INITIAL",       :limit => 9
    t.string   "PPDM_GUID",            :limit => 114
    t.string   "REMARK",               :limit => 4000
    t.string   "SOURCE",               :limit => 60
    t.string   "ROW_CHANGED_BY",       :limit => 90
    t.datetime "ROW_CHANGED_DATE"
    t.string   "ROW_CREATED_BY",       :limit => 90
    t.datetime "ROW_CREATED_DATE"
    t.string   "ROW_QUALITY",          :limit => 60
    t.string   "BA_GROUP",             :limit => 60
  end

  add_index "business_associate", ["BA_NAME"], :name => "BA_NAME"
  add_index "business_associate", ["BA_SHORT_NAME"], :name => "BA_SHORT_NAME"

  create_table "r_well_status", :id => false, :force => true do |t|
    t.string   "STATUS_TYPE",      :limit => 60,   :null => false
    t.string   "STATUS",           :limit => 60,   :null => false
    t.string   "ABBREVIATION",     :limit => 36
    t.string   "ACTIVE_IND",       :limit => 3
    t.datetime "EFFECTIVE_DATE"
    t.datetime "EXPIRY_DATE"
    t.string   "LONG_NAME",        :limit => 180
    t.string   "PPDM_GUID",        :limit => 114
    t.string   "REMARK",           :limit => 4000
    t.string   "SHORT_NAME",       :limit => 90
    t.string   "SOURCE",           :limit => 60
    t.string   "STATUS_GROUP",     :limit => 60
    t.string   "ROW_CHANGED_BY",   :limit => 90
    t.datetime "ROW_CHANGED_DATE"
    t.string   "ROW_CREATED_BY",   :limit => 90
    t.datetime "ROW_CREATED_DATE"
    t.string   "ROW_QUALITY",      :limit => 60
  end

  add_index "r_well_status", ["SHORT_NAME"], :name => "RWS_SHORT_NAME"

  create_table "well", :id => false, :force => true do |t|
    t.string   "UWI",                       :limit => 60,                                  :null => false
    t.datetime "ABANDONMENT_DATE"
    t.string   "ACTIVE_IND",                :limit => 3
    t.string   "ASSIGNED_FIELD",            :limit => 60
    t.string   "BASE_NODE_ID",              :limit => 60
    t.decimal  "BOTTOM_HOLE_LATITUDE",                      :precision => 12, :scale => 7
    t.decimal  "BOTTOM_HOLE_LONGITUDE",                     :precision => 12, :scale => 7
    t.decimal  "CASING_FLANGE_ELEV",                        :precision => 10, :scale => 5
    t.string   "CASING_FLANGE_ELEV_OUOM",   :limit => 60
    t.datetime "COMPLETION_DATE"
    t.datetime "CONFIDENTIAL_DATE"
    t.decimal  "CONFIDENTIAL_DEPTH",                        :precision => 10, :scale => 5
    t.string   "CONFIDENTIAL_DEPTH_OUOM",   :limit => 60
    t.string   "CONFIDENTIAL_TYPE",         :limit => 60
    t.string   "CONFID_STRAT_NAME_SET_ID",  :limit => 60
    t.string   "CONFID_STRAT_UNIT_ID",      :limit => 60
    t.string   "COUNTRY",                   :limit => 60
    t.string   "COUNTY",                    :limit => 60
    t.string   "CURRENT_CLASS",             :limit => 60
    t.string   "CURRENT_STATUS",            :limit => 60
    t.datetime "CURRENT_STATUS_DATE"
    t.decimal  "DEEPEST_DEPTH",                             :precision => 10, :scale => 5
    t.string   "DEEPEST_DEPTH_OUOM",        :limit => 60
    t.string   "DEPTH_DATUM",               :limit => 60
    t.decimal  "DEPTH_DATUM_ELEV",                          :precision => 10, :scale => 5
    t.string   "DEPTH_DATUM_ELEV_OUOM",     :limit => 60
    t.decimal  "DERRICK_FLOOR_ELEV",                        :precision => 10, :scale => 5
    t.string   "DERRICK_FLOOR_ELEV_OUOM",   :limit => 60
    t.decimal  "DIFFERENCE_LAT_MSL",                        :precision => 10, :scale => 5
    t.string   "DISCOVERY_IND",             :limit => 3
    t.string   "DISTRICT",                  :limit => 60
    t.decimal  "DRILL_TD",                                  :precision => 10, :scale => 5
    t.string   "DRILL_TD_OUOM",             :limit => 60
    t.datetime "EFFECTIVE_DATE"
    t.string   "ELEV_REF_DATUM",            :limit => 60
    t.datetime "EXPIRY_DATE"
    t.string   "FAULTED_IND",               :limit => 3
    t.datetime "FINAL_DRILL_DATE"
    t.decimal  "FINAL_TD",                                  :precision => 10, :scale => 5
    t.string   "FINAL_TD_OUOM",             :limit => 60
    t.string   "GEOGRAPHIC_REGION",         :limit => 60
    t.string   "GEOLOGIC_PROVINCE",         :limit => 60
    t.decimal  "GROUND_ELEV",                               :precision => 10, :scale => 5
    t.string   "GROUND_ELEV_OUOM",          :limit => 60
    t.string   "GROUND_ELEV_TYPE",          :limit => 60
    t.string   "INITIAL_CLASS",             :limit => 60
    t.decimal  "KB_ELEV",                                   :precision => 10, :scale => 5
    t.string   "KB_ELEV_OUOM",              :limit => 60
    t.string   "LEASE_NAME",                :limit => 180
    t.string   "LEASE_NUM",                 :limit => 60
    t.string   "LEGAL_SURVEY_TYPE",         :limit => 60
    t.string   "LOCATION_TYPE",             :limit => 60
    t.decimal  "LOG_TD",                                    :precision => 10, :scale => 5
    t.string   "LOG_TD_OUOM",               :limit => 60
    t.decimal  "MAX_TVD",                                   :precision => 10, :scale => 5
    t.string   "MAX_TVD_OUOM",              :limit => 60
    t.decimal  "NET_PAY",                                   :precision => 6,  :scale => 0
    t.string   "NET_PAY_OUOM",              :limit => 60
    t.decimal  "OLDEST_STRAT_AGE",                          :precision => 12, :scale => 0
    t.string   "OLDEST_STRAT_NAME_SET_AGE", :limit => 60
    t.string   "OLDEST_STRAT_NAME_SET_ID",  :limit => 60
    t.string   "OLDEST_STRAT_UNIT_ID",      :limit => 60
    t.string   "OPERATOR",                  :limit => 60
    t.string   "PARENT_RELATIONSHIP_TYPE",  :limit => 60
    t.string   "PARENT_UWI",                :limit => 60
    t.string   "PLATFORM_ID",               :limit => 60
    t.string   "PLATFORM_SF_TYPE",          :limit => 72
    t.string   "PLOT_NAME",                 :limit => 60
    t.string   "PLOT_SYMBOL",               :limit => 60
    t.decimal  "PLUGBACK_DEPTH",                            :precision => 10, :scale => 5
    t.string   "PLUGBACK_DEPTH_OUOM",       :limit => 60
    t.string   "PPDM_GUID",                 :limit => 114
    t.string   "PRIMARY_SOURCE",            :limit => 60
    t.string   "PROFILE_TYPE",              :limit => 60
    t.string   "PROVINCE_STATE",            :limit => 60,                                  :null => false
    t.string   "REGULATORY_AGENCY",         :limit => 60
    t.string   "REMARK",                    :limit => 4000
    t.datetime "RIG_ON_SITE_DATE"
    t.datetime "RIG_RELEASE_DATE"
    t.decimal  "ROTARY_TABLE_ELEV",                         :precision => 10, :scale => 5
    t.string   "SOURCE_DOCUMENT",           :limit => 60
    t.datetime "SPUD_DATE"
    t.string   "STATUS_TYPE",               :limit => 60
    t.string   "SUBSEA_ELEV_REF_TYPE",      :limit => 60
    t.decimal  "SURFACE_LATITUDE",                          :precision => 12, :scale => 7
    t.decimal  "SURFACE_LONGITUDE",                         :precision => 12, :scale => 7
    t.string   "SURFACE_NODE_ID",           :limit => 60
    t.string   "TAX_CREDIT_CODE",           :limit => 60
    t.decimal  "TD_STRAT_AGE",                              :precision => 12, :scale => 0
    t.string   "TD_STRAT_NAME_SET_AGE",     :limit => 60
    t.string   "TD_STRAT_NAME_SET_ID",      :limit => 60
    t.string   "TD_STRAT_UNIT_ID",          :limit => 60
    t.decimal  "WATER_ACOUSTIC_VEL",                        :precision => 10, :scale => 5
    t.string   "WATER_ACOUSTIC_VEL_OUOM",   :limit => 60
    t.decimal  "WATER_DEPTH",                               :precision => 10, :scale => 5
    t.string   "WATER_DEPTH_DATUM",         :limit => 60
    t.string   "WATER_DEPTH_OUOM",          :limit => 60
    t.string   "WELL_EVENT_NUM",            :limit => 12
    t.string   "WELL_GOVERNMENT_ID",        :limit => 60
    t.decimal  "WELL_INTERSECT_MD",                         :precision => 10, :scale => 5
    t.string   "WELL_NAME",                 :limit => 198
    t.string   "WELL_NUM",                  :limit => 60
    t.decimal  "WELL_NUMERIC_ID",                           :precision => 12, :scale => 0
    t.decimal  "WHIPSTOCK_DEPTH",                           :precision => 10, :scale => 5
    t.string   "WHIPSTOCK_DEPTH_OUOM",      :limit => 60
    t.string   "ROW_CHANGED_BY",            :limit => 90
    t.datetime "ROW_CHANGED_DATE"
    t.string   "ROW_CREATED_BY",            :limit => 90
    t.datetime "ROW_CREATED_DATE"
    t.string   "ROW_QUALITY",               :limit => 60
    t.string   "X_CURRENT_LICENSEE",        :limit => 60
    t.decimal  "X_EVENT_NUM",                               :precision => 3,  :scale => 0
    t.decimal  "X_EVENT_NUM_MAX",                           :precision => 3,  :scale => 0
    t.string   "X_OFFSHORE_IND",            :limit => 60
    t.datetime "X_ONPROD_DATE"
    t.datetime "X_ONINJECT_DATE"
    t.string   "X_POOL",                    :limit => 60
    t.string   "X_UWI_SORT",                :limit => 60
    t.string   "X_UWI_DISPLAY",             :limit => 72
    t.decimal  "X_TD_TVD",                                  :precision => 10, :scale => 5
    t.decimal  "X_PLUGBACK_TVD",                            :precision => 10, :scale => 5
    t.decimal  "X_WHIPSTOCK_TVD",                           :precision => 10, :scale => 5
    t.string   "X_ORIGINAL_STATUS",         :limit => 60
    t.string   "X_ORIGINAL_UNIT",           :limit => 36
    t.string   "X_PREVIOUS_STATUS",         :limit => 60
    t.decimal  "CONFID_STRAT_AGE",                          :precision => 12, :scale => 0
    t.string   "X_SURFACE_ABANDON_TYPE",    :limit => 60
    t.string   "GEOG_COORD_SYSTEM_ID",      :limit => 60
    t.string   "LOCATION_QUALIFIER",        :limit => 60
    t.string   "X_CONFIDENTIAL_PERIOD",     :limit => 60
    t.string   "X_PRIMARY_BOREHOLE_UWI",    :limit => 60
    t.string   "X_DIGITAL_LOG_IND",         :limit => 3
    t.string   "X_RASTER_LOG_IND",          :limit => 3
  end

  create_table "well_node", :id => false, :force => true do |t|
    t.string   "NODE_ID",            :limit => 60,                                  :null => false
    t.string   "ACTIVE_IND",         :limit => 3
    t.string   "COORDINATE_QUALITY", :limit => 60
    t.string   "COORD_SYSTEM_ID",    :limit => 60
    t.datetime "EFFECTIVE_DATE"
    t.datetime "EXPIRY_DATE"
    t.decimal  "LATITUDE",                           :precision => 12, :scale => 7
    t.string   "LEGAL_SURVEY_TYPE",  :limit => 60
    t.string   "LOCATION_QUALITY",   :limit => 60
    t.string   "LOCATION_TYPE",      :limit => 60
    t.decimal  "LONGITUDE",                          :precision => 12, :scale => 7
    t.decimal  "NODE_NUMERIC_ID",                    :precision => 12, :scale => 0
    t.string   "NODE_POSITION",      :limit => 60
    t.decimal  "ORIGINAL_OBS_NO",                    :precision => 8,  :scale => 0
    t.string   "ORIGINAL_XY_UOM",    :limit => 60
    t.string   "PLATFORM_ID",        :limit => 60
    t.string   "PLATFORM_SF_TYPE",   :limit => 72
    t.string   "PPDM_GUID",          :limit => 114
    t.string   "PREFERRED_IND",      :limit => 3
    t.string   "REMARK",             :limit => 4000
    t.decimal  "SELECTED_OBS_NO",                    :precision => 8,  :scale => 0
    t.string   "SOURCE",             :limit => 60
    t.string   "UWI",                :limit => 60
    t.string   "ROW_CHANGED_BY",     :limit => 90
    t.datetime "ROW_CHANGED_DATE"
    t.string   "ROW_CREATED_BY",     :limit => 90
    t.datetime "ROW_CREATED_DATE"
    t.string   "ROW_QUALITY",        :limit => 60
  end

end
