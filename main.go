package main

import (
	"encoding/json"
	"encoding/xml"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

const (
	rfc822 = "Mon, 02 Jan 2006 03:04:05 -0700"
)

func main() {
	http.Handle("/public/", http.FileServer(http.Dir(".")))
	http.HandleFunc("/feed", feed)
	http.HandleFunc("/url", postUrl)
	http.ListenAndServe(":8080", nil)
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
	fmt.Printf("%v - %v\n", post.Category, post.Url)
	_, err = url.ParseRequestURI(post.Url)
	if err != nil {
		errorResponse(w, err)
		return
	}
	outputOption := fmt.Sprintf("public/%s/%%(title)s.%%(ext)s", post.Category)
	err = exec.Command("youtube-dl", "-o", outputOption, "--write-thumbnail", "--no-mtime", post.Url).Start()
	if err != nil {
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

type Enclosure struct {
	Length int64  `xml:"length,attr"`
	Type   string `xml:"type,attr"`
	Url    string `xml:"url,attr"`
}

type Item struct {
	Title       string    `xml:"title"`
	Description string    `xml:"description"`
	Enclosure   Enclosure `xml:"enclosure"`
	PubDate     string    `xml:"pubDate"`
}

type Rss struct {
	XMLName        xml.Name `xml:"rss"`
	Version        string   `xml:"version,attr"`
	Xmlns          string   `xml:"xmlns:itunes,attr"`
	ChannelDesc    string   `xml:"channel>description"`
	ChannelTitle   string   `xml:"channel>title"`
	ChannelPubDate string   `xml:"channel>pubDate"`
	Item           []Item   `xml:"channel>item"`
}

func feed(w http.ResponseWriter, r *http.Request) {
	rss := &Rss{
		Version:        "2.0",
		Xmlns:          "http://www.itunes.com/dtds/podcast-1.0.dtd",
		ChannelDesc:    "video podcast",
		ChannelTitle:   "video podcast",
		ChannelPubDate: time.Now().Format(rfc822),
	}
	items, err := items("http://" + r.Host)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	rss.Item = items

	output, err := xml.MarshalIndent(rss, "", "  ")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/xml")
	w.Write(output)
}

func items(host string) ([]Item, error) {
	mp4s, err := globVideos()
	if err != nil {
		return nil, err
	}
	var items []Item
	for _, mp4 := range mp4s {
		enclosure := Enclosure{
			Type:   "video/mp4",
			Length: mp4.Size(),
			Url:    host + "/" + url.PathEscape(mp4.Name()),
		}
		item := Item{
			Title:       mp4.Name(),
			Description: mp4.Name(),
			Enclosure:   enclosure,
			PubDate:     mp4.ModTime().Format(rfc822),
		}
		items = append(items, item)
	}
	return items, nil
}

func globVideos() ([]os.FileInfo, error) {
	files, err := filepath.Glob("public/**/*.mp4")
	if err != nil {
		return nil, err
	}
	var stats []os.FileInfo
	for _, file := range files {
		stat, err := os.Stat(file)
		if err != nil {
			return nil, err
		}
		stats = append(stats, stat)
	}
	return stats, nil
}
