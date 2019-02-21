package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

var (
	publicDir   = "public"
	port        = "8080"
	logPatttern = regexp.MustCompile(`(\d{1,3}\.\d%).+?(ETA.+)`)
	downloader  = "youtube-dl"
)

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/feed", feed)
	router.HandleFunc("/feed/{category}", feed)
	router.HandleFunc("/api/url", postUrl)
	router.HandleFunc("/api/list", list)
	router.HandleFunc("/api/list/{category}", list)
	router.HandleFunc("/api/category", category)
	router.PathPrefix("/public/").Handler(http.StripPrefix("/public/", http.FileServer(http.Dir(publicDir))))
	http.ListenAndServe(":"+port, router)
}

func init() {
	envPublicDir := os.Getenv("PUBLIC_DIR")
	if envPublicDir != "" {
		publicDir = envPublicDir
	}
	envPort := os.Getenv("PORT")
	if envPort != "" {
		port = envPort
	}
}

func errorResponse(w http.ResponseWriter, error error) {
	res, err := json.Marshal(ErrorResponse{
		Message: error.Error(),
	})
	if err != nil {
		fmt.Printf("%v\n", err)
		http.Error(w, error.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusBadRequest)
	w.Write(res)
}

type ErrorResponse struct {
	Message string `json:"errorMessage"`
}

func baseFilename(path string, ext string) string {
	base := filepath.Base(path)
	return strings.Replace(base, ext, "", -1)
}

func escapeFilename(path string) string {
	dir, file := filepath.Split(path)
	escaped := filepath.Join(dir, url.PathEscape(file))
	return escaped
}
