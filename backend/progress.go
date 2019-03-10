package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

func progressAPI(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	requestID := vars["requestID"]
	if requestID == "" {
		http.Error(w, "requestID is not passed.", http.StatusInternalServerError)
		return
	}
	channel, ok := progressMap[requestID]
	if !ok {
		http.Error(w, fmt.Sprintf("requestID[%s] is not in progress.", requestID), http.StatusInternalServerError)
		return
	}
	channel <- progress{}
	progress := <-channel
	res, err := json.Marshal(progressResponse{
		Progress: progress.Percent,
		Title:    progress.Title,
		ETA:      progress.ETA,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if _, err := w.Write(res); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	if progress.Percent >= 100.0 {
		close(channel)
		delete(progressMap, requestID)
	}
}

type progressResponse struct {
	Progress float64 `json:"progress"`
	ETA      string  `json:"ETA"`
	Title    string  `json:"title"`
}
