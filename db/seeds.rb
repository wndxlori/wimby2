# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
require 'csv'

def save_rows_in_transaction(model, rows)
  ActiveRecord::Base.transaction do
    rows.each do |record|
      attrs = record.to_hash.symbolize_keys
      item = model.new(attrs) {|i| i.id = attrs[model.primary_key] }
      item.save!
    end
  end
  rows.clear
end

def load_with_transactions(model, limit = 5000)
  file = "#{Rails.root}/db/seeds/#{model.table_name.upcase}.csv"
  puts("Loading #{file}")
  rows = []
  CSV.foreach(file, :headers => true) do |row|
    rows << row.to_hash.with_indifferent_access
    save_rows_in_transaction(model, rows) unless rows.size < limit
  end
  save_rows_in_transaction(model, rows) unless rows.size < 1
end

[RWellStatus,BusinessAssociate,Well,WellNode].each { |model| load_with_transactions(model, 5000)}
