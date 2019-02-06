package main

import (
	"encoding/xml"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	http.HandleFunc("/feed", feed)
	http.ListenAndServe(":8080", nil)
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
	Xmlns          string   `xml:"xmlns,attr"`
	ChannelDesc    string   `xml:"channel>description"`
	ChannelTitle   string   `xml:"channel>title"`
	ChannelPubDate string   `xml:"channel>pubDate"`
	Item           []Item   `xml:"channel>item"`
}

func feed(w http.ResponseWriter, r *http.Request) {
	rss := &Rss{
		Version:        "2.0",
		Xmlns:          "hoge.dtd",
		ChannelDesc:    "channel desc",
		ChannelTitle:   "title",
		ChannelPubDate: "20110101",
	}
	items, err := items()
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

func items() ([]Item, error) {
	mp4s, err := globVideos()
	if err != nil {
		return nil, err
	}
	var items []Item
	for _, mp4 := range mp4s {
		enclosure := Enclosure{
			Type:   "video/mp4",
			Length: mp4.Size(),
			Url:    "",
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
