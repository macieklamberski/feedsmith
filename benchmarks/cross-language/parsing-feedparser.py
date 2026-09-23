import sys
import os
import glob
import feedparser

def main():
  dir_path, feed_type = sys.argv[1], sys.argv[2]
  limit = int(sys.argv[3]) if len(sys.argv) > 3 else None
  file_pattern = os.path.join(dir_path, f"*.{feed_type}")

  for file_path in sorted(glob.glob(file_pattern))[:limit]:
    if os.path.isfile(file_path):
      with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
      feedparser.parse(content)

main()
