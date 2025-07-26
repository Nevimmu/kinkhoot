// main.go
package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"backend/bdsmrequest"
	_ "backend/migrations"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/pocketbase/pocketbase/tools/hook"
	"github.com/pocketbase/pocketbase/tools/types"
)

type Game struct {
	Id      string         `db:"id" json:"id"`
	Updated types.DateTime `db:"updated" json:"updated"`
}

func main() {
	app := pocketbase.New()

	isGoRun := strings.EqualFold(os.Getenv("BUILD"), "dev")

	var publicDir string
	app.RootCmd.PersistentFlags().StringVar(
		&publicDir,
		"publicDir",
		defaultPublicDir(),
		"the directory to serve static files",
	)

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// enable auto creation of migration files when making collection changes in the Dashboard
		Automigrate: isGoRun,
		Dir:         "/pocketbase/migrations",
	})

	var indexFallback bool
	app.RootCmd.PersistentFlags().BoolVar(
		&indexFallback,
		"indexFallback",
		true,
		"fallback the request to index.html on missing static path, e.g. when pretty urls are used with SPA",
	)

	app.OnServe().Bind(&hook.Handler[*core.ServeEvent]{
		Func: func(e *core.ServeEvent) error {
			if !e.Router.HasRoute(http.MethodGet, "/{path...}") {
				e.Router.GET("/{path...}", apis.Static(os.DirFS(publicDir), indexFallback))
			}

			return e.Next()
		},
		Priority: 999, // execute as latest as possible to allow users to provide their own route
	})

	app.Cron().MustAdd("hello", "0 * * * *", func() {
		games := []Game{}
		err := app.DB().Select("id", "updated").From("games").Where(dbx.NewExp("status = 'finished'")).All(&games)
		if err != nil {
			log.Fatal(err)
		}

		for _, game := range games {
			if isOlderThan(game.Updated.Time(), 5*time.Minute) {
				record, err := app.FindRecordById("games", game.Id)
				if err != nil {
					log.Fatal(err)
				}

				err = app.Delete(record)
				if err != nil {
					log.Fatal(err)
				}
			}
		}
	})

	app.OnRecordAfterCreateSuccess("players").BindFunc(func(e *core.RecordEvent) error {
		url := e.Record.Get("url")
		parts := strings.Split(url.(string), "/")
		code := parts[len(parts)-1]

		jsonData, err := bdsmrequest.GetResult(code)
		if err != nil {
			log.Fatal(err)
		}

		e.Record.Set("results", jsonData)

		app.Save(e.Record)

		return e.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

// the default pb_public dir location is relative to the executable
func defaultPublicDir() string {
	if strings.HasPrefix(os.Args[0], os.TempDir()) {
		// most likely ran with go run
		return "./pb_public"
	}

	return filepath.Join(os.Args[0], "../pb_public")
}

func isOlderThan(t time.Time, duration time.Duration) bool {
	threshold := time.Now().Add(-duration)
	return t.Before(threshold)
}
