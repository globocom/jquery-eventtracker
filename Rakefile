require 'rubygems'
require "bundler/setup"
load 'jasmine/tasks/jasmine.rake'

desc "minify javascript"
task :minify do
  require 'uglifier'
  minified_code = Uglifier.compile File.read("jquery.eventtracker.js")
  File.open("jquery.eventtracker.min.js", "w") do |file|
    file.write("/* jQuery EventTracker v#{File.read("VERSION")} */\n")
    file.write(minified_code)
  end
end