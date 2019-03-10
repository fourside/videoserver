package main

import (
	"encoding/json"
	"net/http"
)

func progressAPI(w http.ResponseWriter, r *http.Request) {
	var list = progressList{}
	for key, channel := range progressMap {
		channel <- progress{}
		progress := <-channel
		progressResponse := progressResponse{
			Progress: progress.Percent,
			ETA:      progress.ETA,
			Title:    progress.Title,
		}
		list = append(list, progressResponse)
		if progress.Percent >= 100.0 {
			close(channel)
			delete(progressMap, key)
		}
	}

	w.Header().Set("Content-Type", "application/json")
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

type progressResponse struct {
	Progress float64 `json:"progress"`
	ETA      string  `json:"ETA"`
	Title    string  `json:"title"`
}
type progressList []progressResponse
type progressListResponse struct {
	ProgressList progressList `json:"progresses"`
}
