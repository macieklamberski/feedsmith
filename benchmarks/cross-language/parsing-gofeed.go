package main

import (
	"fmt"
	"os"
	"path/filepath"
	"github.com/mmcdole/gofeed"
)

func main() {
	dirPath := os.Args[1]
	feedType := os.Args[2]
	pattern := fmt.Sprintf("*.%s", feedType)
	globPattern := filepath.Join(dirPath, pattern)

	matches, _ := filepath.Glob(globPattern)
	fp := gofeed.NewParser()

	for _, path := range matches {
		info, err := os.Stat(path)
		if err != nil || info.IsDir() {
			continue
		}

		content, _ := os.ReadFile(path)
		fp.ParseString(string(content))
	}
}
