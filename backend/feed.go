package main

import (
	"encoding/xml"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"time"

	"github.com/gorilla/mux"
)

const (
	rfc822 = "Mon, 02 Jan 2006 03:04:05 -0700"
)

var (
	videoMimes = map[string]string{
		".mp4":  "video/mp4",
		".mkv":  "video/x-matroska",
		".webm": "video/webm",
	}
)

func feed(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	categoryTitle := ""
	if vars["category"] != "" {
		categoryTitle = " - " + vars["category"]
	}

	rss := &Rss{
		Version:        "2.0",
		Xmlns:          "http://www.itunes.com/dtds/podcast-1.0.dtd",
		ChannelDesc:    "video podcast" + categoryTitle,
		ChannelTitle:   "video podcast" + categoryTitle,
		ChannelPubDate: time.Now().Format(rfc822),
	}

	items, err := globItems("http://"+r.Host, vars["category"])
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
	ModTime     time.Time `xml:"-"`
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

type Items []Item

func (i Items) Len() int {
	return len(i)
}

func (items Items) Swap(i, j int) {
	items[i], items[j] = items[j], items[i]
}

func (items Items) Less(i, j int) bool {
	return items[i].ModTime.Before(items[j].ModTime)
}

func globItems(host string, category string) (Items, error) {
	var items Items
	searchPath := fmt.Sprintf("%s/%s/", publicDir, category)
	err := filepath.Walk(searchPath, func(path string, stat os.FileInfo, err error) error {
		if stat.IsDir() {
			return nil
		}
		if contains(extensions, filepath.Ext(path)) {
			escapedPath := filepath.ToSlash(escapeFilename(path))
			enclosure := Enclosure{
				Type:   videoMimes[filepath.Ext(path)],
				Length: stat.Size(),
				Url:    host + "/" + escapedPath,
			}
			baseName := baseFilename(stat.Name())
			item := Item{
				Title:       baseName,
				Description: baseName,
				Enclosure:   enclosure,
				PubDate:     stat.ModTime().Format(rfc822),
				ModTime:     stat.ModTime(),
			}
			items = append(items, item)
		}
		return nil
	})

	if err != nil {
		return items, err
	}

	sort.Sort(items)
	return items, nil
}
