package main

import (
	"bufio"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"log"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
	"time"
)

var (
	logPatttern = regexp.MustCompile(`(\d{1,3}\.\d)%.+?ETA(.+)`)
	progressMap = make(map[string](chan progress))
)

const (
	downloader = "youtube-dl"
)

func download(url string, category string, subtitle bool) (string, error) {
	outputOption := fmt.Sprintf(publicDir+"/%s/%%(title)s.%%(ext)s", category)
	commandArgs := []string{
		"-o",
		outputOption,
		"--write-thumbnail",
		"--no-mtime",
		"--newline",
		"--no-overwrites",
	}
	if subtitle {
		commandArgs = append(commandArgs, "--write-auto-sub")
	}
	commandArgs = append(commandArgs, url)
	cmd := exec.Command(downloader, commandArgs...)

	streamStderrReader := func(r io.Reader) {
		scanner := bufio.NewScanner(r)
		for scanner.Scan() {
			log.Printf("[err] %s", scanner.Text())
		}
	}

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return "", err
	}
	stderr, err := cmd.StderrPipe()
	if err != nil {
		return "", err
	}
	sum := sha256.Sum256([]byte(url))
	requestID := hex.EncodeToString(sum[:])
	channel := make(chan progress)
	progressMap[requestID] = channel
	go streamStdoutReader(stdout, url, channel, requestID)
	go streamStderrReader(stderr)

	err = cmd.Start()
	return requestID, err
}

func getVideoTitle(url string) string {
	commandArgs := []string{
		"--get-title",
		url,
	}
	out, _ := exec.Command(downloader, commandArgs...).CombinedOutput()
	return strings.TrimRight(string(out), "\n")
}

func streamStdoutReader(r io.Reader, url string, channel chan progress, requestID string) {
	title := getVideoTitle(url)
	scanner := bufio.NewScanner(r)
	var percent = 0.0
	var eta = ""
	var isEnd = false
	var now = time.Now()
	go func() {
		for {
			<-channel
			if isEnd {
				delete(progressMap, requestID)
				close(channel)
				break
			}
			channel <- progress{Title: title, Percent: percent, ETA: eta, CreatedAt: now}
		}
	}()
	for scanner.Scan() {
		stdout := scanner.Text()
		result := logPatttern.FindSubmatch([]byte(stdout))
		if len(result) > 0 {
			percent, _ = strconv.ParseFloat(string(result[1]), 64)
			eta = string(result[2])
		}
	}
	isEnd = true
}

type progress struct {
	Title     string
	Percent   float64
	ETA       string
	CreatedAt time.Time
}
