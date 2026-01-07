import sys
import os
import glob
import feedparser

def main():
  dir_path, feed_type = sys.argv[1], sys.argv[2]
  file_pattern = os.path.join(dir_path, f"*.{feed_type}")

  for file_path in glob.glob(file_pattern):
    if os.path.isfile(file_path):
      with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
      feedparser.parse(content)

main()
