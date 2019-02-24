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

	feed := &rss{
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
	feed.Item = items

	output, err := xml.MarshalIndent(feed, "", "  ")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/xml")
	if _, err := w.Write(output); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

type enclosure struct {
	Length int64  `xml:"length,attr"`
	Type   string `xml:"type,attr"`
	URL    string `xml:"url,attr"`
}

type item struct {
	Title       string    `xml:"title"`
	Description string    `xml:"description"`
	Enclosure   enclosure `xml:"enclosure"`
	PubDate     string    `xml:"pubDate"`
	ModTime     time.Time `xml:"-"`
}

type rss struct {
	XMLName        xml.Name `xml:"rss"`
	Version        string   `xml:"version,attr"`
	Xmlns          string   `xml:"xmlns:itunes,attr"`
	ChannelDesc    string   `xml:"channel>description"`
	ChannelTitle   string   `xml:"channel>title"`
	ChannelPubDate string   `xml:"channel>pubDate"`
	Item           []item   `xml:"channel>item"`
}

type items []item

func (is items) Len() int {
	return len(is)
}

func (is items) Swap(i, j int) {
	is[i], is[j] = is[j], is[i]
}

func (is items) Less(i, j int) bool {
	return is[i].ModTime.Before(is[j].ModTime)
}

func globItems(host string, category string) (items, error) {
	var itemList items
	searchPath := fmt.Sprintf("%s/%s/", publicDir, category)
	err := filepath.Walk(searchPath, func(path string, stat os.FileInfo, err error) error {
		if stat.IsDir() {
			return nil
		}
		if contains(extensions, filepath.Ext(path)) {
			escapedPath := filepath.ToSlash(escapeFilename(path))
			enclosure := enclosure{
				Type:   videoMimes[filepath.Ext(path)],
				Length: stat.Size(),
				URL:    host + "/" + escapedPath,
			}
			baseName := baseFilename(stat.Name())
			i := item{
				Title:       baseName,
				Description: baseName,
				Enclosure:   enclosure,
				PubDate:     stat.ModTime().Format(rfc822),
				ModTime:     stat.ModTime(),
			}
			itemList = append(itemList, i)
		}
		return nil
	})

	if err != nil {
		return itemList, err
	}

	sort.Sort(itemList)
	return itemList, nil
}
