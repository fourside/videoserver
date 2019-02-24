package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"path/filepath"
	"sort"
)

func category(w http.ResponseWriter, r *http.Request) {
	category, err := globCategory()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	res, err := json.Marshal(categoryResponse{
		Category: category,
	})
	if err != nil {
		fmt.Printf("%v\n", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if _, err := w.Write(res); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
}

func globCategory() ([]string, error) {
	catDirs, err := filepath.Glob(publicDir + "/*")
	if err != nil {
		return nil, err
	}
	var category []string
	for _, catDir := range catDirs {
		base := filepath.Base(catDir)
		category = append(category, base)
	}
	sort.Strings(category)
	return category, nil
}

type categoryResponse struct {
	Category []string `json:"categories"`
}
