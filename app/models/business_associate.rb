class BusinessAssociate < WimbyBase
  set_table_name :business_associate
  set_primary_key :business_associate
  
  has_many :wells, :foreign_key => :operator
end
