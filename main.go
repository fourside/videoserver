package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"os/exec"
)

var (
	publicDir = "public"
	port      = "8080"
)

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/feed", feed)
	router.HandleFunc("/feed/{category}", feed)
	router.HandleFunc("/url", postUrl)
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

	outputOption := fmt.Sprintf(publicDir+"/%s/%%(title)s.%%(ext)s", post.Category)
	commandArgs := []string{
		"-o",
		outputOption,
		"--write-thumbnail",
		"--no-mtime",
		"--newline",
		"--no-overwrites",
		post.Url,
	}
	cmd := exec.Command("youtube-dl", commandArgs...)

	streamReader := func(r io.Reader, label string) {
		scanner := bufio.NewScanner(r)
		for scanner.Scan() {
			log.Printf("[ %s ] %s", label, scanner.Text())
		}
	}

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		errorResponse(w, err)
		return
	}
	stderr, err := cmd.StderrPipe()
	if err != nil {
		errorResponse(w, err)
		return
	}
	go streamReader(stdout, "stdout")
	go streamReader(stderr, "stderr")

	err = cmd.Start()
	if err != nil {
		log.Printf("command failed: %v", err.Error())
		errorResponse(w, err)
		return
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

type PostUrlRequest struct {
	Url      string `json:"url"`
	Category string `json:"category"`
}

type ErrorResponse struct {
	Message string `json:"errorMessage"`
}
