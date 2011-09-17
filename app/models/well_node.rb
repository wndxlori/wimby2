class WellNode < WimbyBase
  set_table_name :well_node
  set_primary_key :node_id
  has_one :well
end
