package main

import (
	"flag"
	"fmt"
	"net/http"
	"strings"
	build "webdav/web"

	"golang.org/x/net/webdav"
)

func main() {

	var (
		directory = flag.String("dir", "./", "directory to be shared using webdav protocol")
		port      = flag.Int("port", 8888, "port for http server")
	)

	flag.Parse()

	filesystem, err := build.GetFS()

	if nil != err {
		fmt.Println("Error:", err)
		return
	}

	var (
		web    = http.FileServer(http.FS(filesystem))
		webdav = &webdav.Handler{
			Prefix:     "/webdav",
			FileSystem: webdav.Dir(*directory),
			LockSystem: webdav.NewMemLS(),
		}
	)

	mux := http.NewServeMux()
	mux.HandleFunc("/", func(writer http.ResponseWriter, request *http.Request) {
		defer request.Body.Close()
		if strings.HasPrefix(request.URL.Path, "/webdav") {
			webdav.ServeHTTP(writer, request)
			return
		}

		if strings.HasPrefix(request.URL.Path, "/web") {
			http.Redirect(writer, request, "/", http.StatusFound)
			return
		}

		var (
			name  = "Cache-Control"
			value = "no-cache, no-store, no-transform, must-revalidate, private, max-age=0"
		)
		writer.Header().Add(name, value)
		web.ServeHTTP(writer, request)
	})

	err = http.ListenAndServe(fmt.Sprintf("0.0.0.0:%d", *port), mux)
	if nil != err {
		fmt.Println("Error:", err)
	}
}
