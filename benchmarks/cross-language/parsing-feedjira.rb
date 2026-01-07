require 'feedjira'

def main
  dir_path, feed_type = ARGV

  Dir.glob(File.join(dir_path, "*.#{feed_type}")).each do |file_path|
    content = File.read(file_path)
    Feedjira.parse(content)
  end
end

main
