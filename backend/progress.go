package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

func progress(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	requestID := vars["requestID"]
	if requestID == "" {
		http.Error(w, "requestID is not passed.", http.StatusInternalServerError)
		return
	}
	_, ok := progressMap[requestID]
	if !ok {
		http.Error(w, fmt.Sprintf("requestID[%s] is not in progress.", requestID), http.StatusInternalServerError)
		return
	}
}
