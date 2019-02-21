package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
)

var (
	publicDir = "public"
	port      = "8080"
)

func main() {

	logger := log.New(os.Stdout, "http: ", log.LstdFlags)
	logger.Println("video server is starting...")

	router := mux.NewRouter()
	router.HandleFunc("/feed", feed)
	router.HandleFunc("/feed/{category}", feed)
	router.HandleFunc("/api/url", postUrl)
	router.HandleFunc("/api/list", list)
	router.HandleFunc("/api/list/{category}", list)
	router.HandleFunc("/api/category", category)
	router.PathPrefix("/public/").Handler(http.StripPrefix("/public/", http.FileServer(http.Dir(publicDir))))

	server := &http.Server{
		Addr:     ":" + port,
		Handler:  logging(logger)(router),
		ErrorLog: logger,
	}
	if err := server.ListenAndServe(); err != nil {
		logger.Fatalf("could not listen on %s: %v", port, err)
	}
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

func logging(logger *log.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				logger.Println(r.Method, r.URL.Path)
			}()
			next.ServeHTTP(w, r)
		})
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
