package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"path/filepath"
	"sort"
	"time"
)

func progressAPI(w http.ResponseWriter, r *http.Request) {
	var list = progressList{}
	for _, channel := range progressMap {
		channel <- progress{}
		progress := <-channel
		imagePath, err := globImagePath(progress.Title)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		progressResponse := progressResponse{
			Progress:  progress.Percent,
			ETA:       progress.ETA,
			Title:     progress.Title,
			Image:     fmt.Sprintf("http://%s/%s", r.Host, filepath.ToSlash(escapeFilename(imagePath))),
			CreatedAt: progress.CreatedAt,
		}
		list = append(list, progressResponse)
	}

	w.Header().Set("Content-Type", "application/json")
	sort.Sort(list)
	res, err := json.Marshal(progressListResponse{
		ProgressList: list,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if _, err := w.Write(res); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
}

func globImagePath(title string) (string, error) {
	matches, err := filepath.Glob(publicDir + "/**/" + title + ".jpg")
	if err != nil {
		return "", err
	}
	return matches[0], nil
}

type progressResponse struct {
	Progress  float64   `json:"progress"`
	ETA       string    `json:"ETA"`
	Title     string    `json:"title"`
	Image     string    `json:"image"`
	CreatedAt time.Time `json:"-"`
}
type progressList []progressResponse
type progressListResponse struct {
	ProgressList progressList `json:"progresses"`
}

func (v progressList) Len() int {
	return len(v)
}

func (v progressList) Swap(i, j int) {
	v[i], v[j] = v[j], v[i]
}

func (v progressList) Less(i, j int) bool {
	return v[i].CreatedAt.After(v[j].CreatedAt)
}
