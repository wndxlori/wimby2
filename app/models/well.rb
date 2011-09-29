class Well < ActiveRecord::Base
  set_table_name :well
  set_primary_key :uwi

  belongs_to :company, :class_name => 'BusinessAssociate', :foreign_key => :operator
  belongs_to :r_well_status, :foreign_key => :current_status
#  belongs_to :surface_location, :class_name => '::WellNode', :foreign_key => :surface_node_id

  def status_age_index
    Date.today - self.status_date.to_date
  end

  ABANDONED_WELL_CONDITION = "well.plot_symbol in ( '348', '383', '396', '364', '392', '601') or well.current_status in ('22020000','23020000','23030000')"
  SELECTS = "well.uwi as i, business_associate.ba_name as o, r_well_status.long_name as s, well.current_status_date as status_date, well.x_uwi_display  as d, well.well_name as u"

  def self.find_for_web_map(options)
    clustered = options[:clustered] == 'true'
    regions = options[:regions]
    raise "invalid regions" unless regions && regions.length>0

    ranges = regions.collect { |i,r| "(well.surface_latitude between #{r[:s].to_f} AND #{r[:n].to_f} AND well.surface_longitude between #{r[:w].to_f} AND #{r[:e].to_f})" }

    if clustered
      Well.find_for_web_map_clustered(regions.values, ranges, options[:scale])
    else
      Well.find_for_web_map_bounded(ranges)
    end
  end

  def self.find_for_web_map_bounded(ranges)
    selects = [SELECTS]
    selects << 'well.surface_longitude as w'
    selects << 'well.surface_latitude as n'

    Well.all(:select => 'DISTINCT ' + selects * ', ' ,
             :joins => [:company, :r_well_status],
             :order => "status_date",
             :conditions => "(#{(ranges * ' OR ' )})" ) # AND (#{ABANDONED_WELL_CONDITION})" )
  end

  def self.find_for_web_map_clustered(regions, ranges, scale)
    ntiles_lat = (scale[:v].to_f/25).ceil
    ntiles_lng = (scale[:h].to_f/25).ceil

    minlat = regions.collect {|a| a[:s].to_f }.min
    maxlat = regions.collect {|a| a[:n].to_f }.max
    delta_lat = (maxlat-minlat)/ntiles_lat
    minlng = regions.collect {|a| a[:w].to_f }.min
    maxlng = regions.collect {|a| a[:e].to_f }.max
    delta_lng = (maxlng-minlng)/ntiles_lng

    wis_sql = %[
      (select #{SELECTS}
      from well
      join business_associate on well.operator = business_associate.business_associate
      join r_well_status on well.current_status = r_well_status.status)
    ]
#    where #{ABANDONED_WELL_CONDITION}

    base_sql = %[
        select
               (case count when 1 then wis.i else '' end) as i,
               (case count when 1 then wis.o else '' end) as o,
               (case count when 1 then wis.s else '' end) as s,
               (case count when 1 then wis.status_date else CURRENT_TIMESTAMP end) as status_date,
               (case count when 1 then wis.d else '' end) as d,
               (case count when 1 then wis.u else '' end) as u,
               longitude as w, latitude as n, count as c
        from
          (select avg(longitude) as longitude, avg(latitude) as latitude, min(uwi) as uwi, count(*) as count
           from (
              select uwi, surface_longitude as longitude, surface_latitude as latitude,
                     round((surface_latitude - #{minlat})/ #{delta_lat} ) as a,
                     round((surface_longitude - (#{minlng}))/ #{delta_lng} ) as b
              from well
              where (#{ranges * ' OR ' })
             ) as f1 group by a, b
           ) as f
    ]
#    sql = "with wis as (#{wis_sql}) " +
    sql = base_sql +
          "inner join (#{wis_sql}) wis on wis.i=f.uwi"
    self.find_by_sql( sql )
  end

end
