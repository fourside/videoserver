package main

import (
	"encoding/json"
	"log"
	"net/http"
	"net/url"
)

func postUrl(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	if r.Header.Get("Content-Type") != "application/json" {
		w.WriteHeader(http.StatusNotAcceptable)
		return
	}

	decoder := json.NewDecoder(r.Body)
	var post PostUrlRequest
	err := decoder.Decode(&post)
	if err != nil {
		errorResponse(w, err)
		return
	}

	_, err = url.ParseRequestURI(post.Url)
	if err != nil {
		errorResponse(w, err)
		return
	}

	err = download(post.Url, post.Category, post.Subtitle)
	if err != nil {
		log.Printf("command failed: %v", err.Error())
		errorResponse(w, err)
		return
	}
}

type PostUrlRequest struct {
	Url      string `json:"url"`
	Category string `json:"category"`
	Subtitle bool   `json:"subtitle"`
}
