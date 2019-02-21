package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os/exec"
	"regexp"
	"strings"
)

var (
	logPatttern = regexp.MustCompile(`(\d{1,3}\.\d%).+?(ETA.+)`)
)

const (
	downloader = "youtube-dl"
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

	outputOption := fmt.Sprintf(publicDir+"/%s/%%(title)s.%%(ext)s", post.Category)
	commandArgs := []string{
		"-o",
		outputOption,
		"--write-thumbnail",
		"--no-mtime",
		"--newline",
		"--no-overwrites",
	}
	if post.Subtitle {
		commandArgs = append(commandArgs, "--write-auto-sub")
	}
	commandArgs = append(commandArgs, post.Url)
	cmd := exec.Command(downloader, commandArgs...)

	streamStdoutReader := func(r io.Reader, url string) {
		title := getVideoTitle(url)
		scanner := bufio.NewScanner(r)
		for scanner.Scan() {
			stdout := scanner.Text()
			result := logPatttern.FindSubmatch([]byte(stdout))
			if len(result) > 0 {
				log.Printf("%s : %s, %s", title, string(result[1]), string(result[2]))
			}
		}
	}
	streamStderrReader := func(r io.Reader) {
		scanner := bufio.NewScanner(r)
		for scanner.Scan() {
			log.Printf("[err] %s", scanner.Text())
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
	go streamStdoutReader(stdout, post.Url)
	go streamStderrReader(stderr)

	err = cmd.Start()
	if err != nil {
		log.Printf("command failed: %v", err.Error())
		errorResponse(w, err)
		return
	}
}

func getVideoTitle(url string) string {
	commandArgs := []string{
		"--get-title",
		url,
	}
	out, _ := exec.Command(downloader, commandArgs...).CombinedOutput()
	return strings.TrimRight(string(out), "\n")
}

type PostUrlRequest struct {
	Url      string `json:"url"`
	Category string `json:"category"`
	Subtitle bool   `json:"subtitle"`
}
