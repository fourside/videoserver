package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

func progress(w http.ResponseWriter, r *http.Request) {
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
	channel <- "give me the progress"
	progress := <-channel
	res, err := json.Marshal(progressResponse{
		Progress: progress,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if _, err := w.Write(res); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
}

type progressResponse struct {
	Progress string `json:"progress"`
}
