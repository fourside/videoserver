package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
)

const (
	itemPerPage = 15
)

func list(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	videos, err := glob("http://"+r.Host, vars["category"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	total := len(videos)

	offset := r.URL.Query()["offset"]
	videos = slice(videos, offset)

	res, err := json.Marshal(listResponse{
		VideoList: videos,
		Total:     total,
	})
	if err != nil {
		fmt.Printf("%v\n", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if _, err := w.Write(res); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
}

func glob(host string, category string) (videos, error) {
	var vs videos
	searchPath := fmt.Sprintf("%s/%s/", publicDir, category)
	err := filepath.Walk(searchPath, func(path string, stat os.FileInfo, err error) error {
		if stat.IsDir() {
			return nil
		}
		if contains(extensions, filepath.Ext(path)) {
			escapedPath := filepath.ToSlash(escapeFilename(path))
			cat := category
			if category == "" {
				cat = filepath.Base(filepath.Dir(path))
			}
			v := video{
				Title:    baseFilename(path),
				Image:    host + "/" + filepath.ToSlash(escapeFilename(toJpegPath(path))),
				URL:      host + "/" + escapedPath,
				Category: cat,
				Bytes:    stat.Size(),
				Mtime:    stat.ModTime().Format("2006-01-02 15:03:04 -0700"),
				ModTime:  stat.ModTime(),
			}
			vs = append(vs, v)
		}
		return nil
	})

	if err != nil {
		return vs, err
	}

	sort.Sort(vs)
	return vs, nil
}

func slice(vs videos, offsetParam []string) videos {
	offset := 0
	if len(offsetParam) > 0 {
		offset, _ = strconv.Atoi(offsetParam[0])
	}

	size := len(vs)
	begin := offset * itemPerPage
	if begin > size {
		return videos{}
	}

	end := begin + itemPerPage
	if end > size {
		return vs[begin:]
	}

	return vs[begin:end]
}

func toJpegPath(path string) string {
	dir, file := filepath.Split(path)
	ext := filepath.Ext(file)
	jpeg := strings.Replace(file, ext, ".jpg", -1)
	jpegPath := filepath.Join(dir, jpeg)
	return jpegPath
}

func (v videos) Len() int {
	return len(v)
}

func (v videos) Swap(i, j int) {
	v[i], v[j] = v[j], v[i]
}

func (v videos) Less(i, j int) bool {
	return v[i].ModTime.After(v[j].ModTime)
}

type videos []video
type video struct {
	Title    string    `json:"title"`
	Image    string    `json:"image"`
	URL      string    `json:"url"`
	Category string    `json:"category"`
	Bytes    int64     `json:"bytes"`
	Mtime    string    `json:"mtime"`
	ModTime  time.Time `json:"-"`
}
type listResponse struct {
	VideoList videos `json:"videos"`
	Total     int    `json:"total"`
}
