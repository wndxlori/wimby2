source 'http://rubygems.org'

gem 'rails', '~> 3.1.10'

#gem 'ruby-oci8'
#gem 'activerecord-oracle_enhanced-adapter'

#group :development, :test do
#  gem 'sqlite3'
#end
gem 'pg'

gem 'newrelic_rpm'

group :production do
#  gem 'pg'
  gem 'dalli'
  gem 'rack-cache', :require => 'rack/cache'
  gem 'rack-contrib', :require => 'rack/contrib'
end

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails'
  gem 'coffee-rails'
  gem 'uglifier'
end

gem 'jquery-rails'

# Use unicorn as the web server
# gem 'unicorn'

# Deploy with Capistrano
gem 'capistrano'

# To use debugger
# gem 'ruby-debug19', :require => 'ruby-debug'

group :test, :development do
  gem 'rspec-rails'
  gem 'webrat'
  # Pretty printed test output
  gem 'turn', :require => false
end
