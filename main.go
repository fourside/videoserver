package main

import (
	"encoding/json"
	"encoding/xml"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"time"
)

var (
	publicDir = "public"
	port      = "8080"
)

const (
	rfc822 = "Mon, 02 Jan 2006 03:04:05 -0700"
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
	fmt.Printf("%v - %v\n", post.Category, post.Url)
	_, err = url.ParseRequestURI(post.Url)
	if err != nil {
		errorResponse(w, err)
		return
	}
	outputOption := fmt.Sprintf(publicDir+"/%s/%%(title)s.%%(ext)s", post.Category)
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

func feed(w http.ResponseWriter, r *http.Request) {
	rss := &Rss{
		Version:        "2.0",
		Xmlns:          "http://www.itunes.com/dtds/podcast-1.0.dtd",
		ChannelDesc:    "video podcast",
		ChannelTitle:   "video podcast",
		ChannelPubDate: time.Now().Format(rfc822),
	}
	vars := mux.Vars(r)
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

func globItems(host string, category string) (Items, error) {
	cat := category
	if category == "" {
		cat = "**"
	}
	pattern := fmt.Sprintf("/%s/*.mp4", cat)
	mp4s, err := filepath.Glob(publicDir + pattern)
	if err != nil {
		return nil, err
	}
	var items Items
	for _, mp4 := range mp4s {
		stat, err := os.Stat(mp4)
		if err != nil {
			return nil, err
		}
		enclosure := Enclosure{
			Type:   "video/mp4",
			Length: stat.Size(),
			Url:    host + "/" + url.PathEscape(filepath.ToSlash(mp4)),
		}
		item := Item{
			Title:       stat.Name(),
			Description: stat.Name(),
			Enclosure:   enclosure,
			PubDate:     stat.ModTime().Format(rfc822),
			ModTime:     stat.ModTime(),
		}
		items = append(items, item)
	}
	sort.Sort(items)
	return items, nil
}
