package main

import (
	"encoding/json"
	"encoding/xml"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"time"
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
	var post PostUrl
	err := decoder.Decode(&post)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	_, err = url.ParseRequestURI(post.Url)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

}

type PostUrl struct {
	Url string `json:"url"`
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
		ChannelPubDate: time.Now().Format("Mon, 02 Jan 2006 03:04:05 -0700"),
	}
	items, err := items("http://" + r.Host + "/public")
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

func items(path string) ([]Item, error) {
	mp4s, err := globVideos()
	if err != nil {
		return nil, err
	}
	var items []Item
	for _, mp4 := range mp4s {
		enclosure := Enclosure{
			Type:   "video/mp4",
			Length: mp4.Size(),
			Url:    path + "/" + url.PathEscape(mp4.Name()),
		}
		item := Item{
			Title:       mp4.Name(),
			Description: mp4.Name(),
			Enclosure:   enclosure,
			PubDate:     mp4.ModTime().Format("Mon, 02 Jan 2006 03:04:05 -0700"),
		}
		items = append(items, item)
	}
	return items, nil
}

func globVideos() ([]os.FileInfo, error) {
	files, err := filepath.Glob("public/*.mp4")
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
