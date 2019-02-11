package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

func list(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	videos, err := glob("http://"+r.Host, vars["category"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res, err := json.Marshal(ListResponse{
		VideoList: videos,
	})
	if err != nil {
		fmt.Printf("%v\n", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}

func glob(host string, category string) (Videos, error) {
	cat := category
	if category == "" {
		cat = "**"
	}
	pattern := fmt.Sprintf("/%s/*.mp4", cat)
	mp4s, err := filepath.Glob(publicDir + pattern)
	if err != nil {
		return nil, err
	}
	var videos Videos
	for _, mp4 := range mp4s {
		stat, err := os.Stat(mp4)
		if err != nil {
			return nil, err
		}
		escapedPath := filepath.ToSlash(escapeFilename(mp4))
		video := Video{
			Title:    baseFilename(mp4, ".mp4"),
			Image:    host + "/" + filepath.ToSlash(escapeFilename(toJpegPath(mp4))),
			Url:      host + "/" + escapedPath,
			Category: category,
			ModTime:  stat.ModTime(),
		}
		videos = append(videos, video)
	}
	sort.Sort(videos)
	return videos, nil
}

func toJpegPath(path string) string {
	dir, file := filepath.Split(path)
	jpeg := strings.Replace(file, ".mp4", ".jpg", -1)
	jpegPath := filepath.Join(dir, jpeg)
	return jpegPath
}

func (v Videos) Len() int {
	return len(v)
}

func (v Videos) Swap(i, j int) {
	v[i], v[j] = v[j], v[i]
}

func (v Videos) Less(i, j int) bool {
	return v[i].ModTime.Before(v[j].ModTime)
}

type Videos []Video
type Video struct {
	Title    string    `json:"title"`
	Image    string    `json:"image"`
	Url      string    `json:"url"`
	Category string    `json:"category"`
	ModTime  time.Time `json:"mtime"`
}
type ListResponse struct {
	VideoList Videos `json:"videos"`
}
