package web

import (
	"embed"
	"io/fs"
)

//go:generate npm install
//go:generate npm run build

//go:embed build/*
var WWW embed.FS

func GetFS() (fs.FS, error) {
	filesystem := fs.FS(WWW)
	child, err := fs.Sub(filesystem, "build")
	if nil != err {
		return nil, err
	}
	return child, nil
}
