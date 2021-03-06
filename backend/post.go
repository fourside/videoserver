package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
)

const (
	downloadLimit = 3
)

func postURL(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	if r.Header.Get("Content-Type") != "application/json" {
		w.WriteHeader(http.StatusNotAcceptable)
		return
	}
	if len(progressMap) >= downloadLimit {
		w.WriteHeader(http.StatusBadRequest)
		responseError(w, fmt.Errorf("download limited: %v", len(progressMap)))
		return
	}

	decoder := json.NewDecoder(r.Body)
	var post postURLRequest
	err := decoder.Decode(&post)
	if err != nil {
		responseError(w, err)
		return
	}

	_, err = url.ParseRequestURI(post.URL)
	if err != nil {
		responseError(w, err)
		return
	}

	reqestID, err := download(post.URL, post.Category, post.Subtitle)
	if err != nil {
		log.Printf("command failed: %v", err.Error())
		responseError(w, err)
		return
	}
	w.Header().Set("X-Request-ID", reqestID)
}

type postURLRequest struct {
	URL      string `json:"url"`
	Category string `json:"category"`
	Subtitle bool   `json:"subtitle"`
}
