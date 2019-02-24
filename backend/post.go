package main

import (
	"encoding/json"
	"log"
	"net/http"
	"net/url"
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

	err = download(post.URL, post.Category, post.Subtitle)
	if err != nil {
		log.Printf("command failed: %v", err.Error())
		responseError(w, err)
		return
	}
}

type postURLRequest struct {
	URL      string `json:"url"`
	Category string `json:"category"`
	Subtitle bool   `json:"subtitle"`
}
