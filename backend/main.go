package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"time"

	"github.com/gorilla/mux"
)

var (
	publicDir  = "public"
	port       = "8080"
	extensions = []string{
		".mp4",
		".webm",
		".mkv",
	}
)

func main() {

	logger := log.New(os.Stdout, "http: ", log.LstdFlags)
	logger.Println("video server is starting...")

	router := mux.NewRouter()
	router.HandleFunc("/feed", feed)
	router.HandleFunc("/feed/{category}", feed)
	router.HandleFunc("/api/url", postURL)
	router.HandleFunc("/api/list", list)
	router.HandleFunc("/api/list/{category}", list)
	router.HandleFunc("/api/category", category)
	router.HandleFunc("/api/progress", progressAPI)
	router.PathPrefix("/").Handler(http.FileServer(http.Dir(publicDir)))

	server := &http.Server{
		Addr:     ":" + port,
		Handler:  logging(logger)(router),
		ErrorLog: logger,
	}

	done := make(chan bool)
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)

	go func() {
		<-quit
		logger.Println("video server is shutting down...")
		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		server.SetKeepAlivesEnabled(false)
		if err := server.Shutdown(ctx); err != nil {
			logger.Fatalf("could not gracefully shutdown: :%v\n", err)
		}
		close(done)
	}()

	if err := server.ListenAndServe(); err != nil {
		logger.Fatalf("could not listen on %s: %v\n", port, err)
	}

	<-done
	logger.Println("video server is stopped")
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
			resRec := &responseRecorder{
				status:         200,
				ResponseWriter: w,
			}
			defer func() {
				logger.Println(r.Method, r.URL.Path, resRec.status)
			}()
			next.ServeHTTP(resRec, r)
		})
	}
}

type responseRecorder struct {
	status int
	http.ResponseWriter
}

func (h *responseRecorder) WriteHeader(code int) {
	h.status = code
	h.ResponseWriter.WriteHeader(code)
}

func responseError(w http.ResponseWriter, error error) {
	res, err := json.Marshal(errorResponse{
		Message: error.Error(),
	})
	if err != nil {
		fmt.Printf("%v\n", err)
		http.Error(w, error.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusBadRequest)
	if _, err := w.Write(res); err != nil {
		fmt.Printf("%v\n", err)
	}
}

type errorResponse struct {
	Message string `json:"errorMessage"`
}

func baseFilename(path string) string {
	base := filepath.Base(path)
	ext := filepath.Ext(path)
	return strings.Replace(base, ext, "", -1)
}

func escapeFilename(path string) string {
	path = strings.Replace(path, publicDir, "", 1)
	dir, file := filepath.Split(path)
	escaped := filepath.Join(dir, url.PathEscape(file))
	return escaped
}

func contains(hay []string, needle string) bool {
	for _, target := range hay {
		if target == needle {
			return true
		}
	}
	return false
}
