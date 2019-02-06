package main

import (
	"encoding/xml"
	"net/http"
)

func main() {
	http.HandleFunc("/feed", feed)
	http.ListenAndServe(":8080", nil)
}

type Enclosure struct {
	Length int    `xml:"length,attr"`
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
	rss.Item = []Item{
		Item{
			Title:       "hoge",
			Description: "fuga",
			PubDate:     "piyo",
		},
		Item{
			Title:       "foo",
			Description: "bar",
			PubDate:     "baz",
		},
	}
	output, err := xml.MarshalIndent(rss, "", "  ")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/xml")
	w.Write(output)
}
