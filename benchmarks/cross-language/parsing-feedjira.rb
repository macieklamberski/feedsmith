require 'feedjira'

def main
  dir_path, feed_type, limit = ARGV
  file_paths = Dir.glob(File.join(dir_path, "*.#{feed_type}"))
  file_paths = file_paths.first(limit.to_i) if limit

  file_paths.each do |file_path|
    content = File.read(file_path)
    Feedjira.parse(content)
  end
end

main
