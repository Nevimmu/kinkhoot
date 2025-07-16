package bdsmrequest

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/chromedp/cdproto/cdp"
	"github.com/chromedp/cdproto/network"
	"github.com/chromedp/chromedp"
)

type Score struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	PairDesc    string `json:"pairdesc"`
	Description string `json:"description"`
	Score       int    `json:"score"`
}

type Result struct {
	Scores []Score `json:"scores"`
	// Lang      string  `json:"lang"`
	// Date      string  `json:"date"`
	// Version   int     `json:"version"`
	// Gender    string  `json:"gender"`
	// Location  string  `json:"location"`
	// Auth      bool    `json:"auth"`
	// Alignment int     `json:"alignment"`
}

type UserScore struct {
	Name  string `json:"name"`
	Score int    `json:"score"`
}

// GetResult fetches the BDSM test result for a given ID.
func GetResult(resultID string) (string, error) {
	testURL := "https://bdsmtest.org/r/" + resultID

	// Create a new cancellable context
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Create a new chromedp context
	ctx, cancel = chromedp.NewContext(ctx)
	defer cancel()

	// Channel to receive the JSON response
	jsonCh := make(chan string, 1)

	// Set up a listener for the AJAX response
	requestIDChan := make(chan network.RequestID, 1)
	chromedp.ListenTarget(ctx, func(ev interface{}) {
		switch e := ev.(type) {
		case *network.EventResponseReceived:
			if e.Response.URL == "https://bdsmtest.org/ajax/getresult" {
				requestIDChan <- e.RequestID
			}
		case *network.EventLoadingFinished:
			select {
			case requestID := <-requestIDChan:
				if e.RequestID == requestID {
					go func() {
						c := chromedp.FromContext(ctx)
						body, err := network.GetResponseBody(e.RequestID).Do(cdp.WithExecutor(ctx, c.Target))
						if err != nil {
							log.Printf("Error getting response body: %v", err)
							return
						}
						jsonCh <- string(body)
					}()
				}
			default:
				// do nothing
			}
		}
	})

	var capturedJSON string
	err := chromedp.Run(ctx,
		network.Enable(),
		chromedp.Navigate(testURL),
		// This action will block until the jsonCh has data
		chromedp.ActionFunc(func(ctx context.Context) error {
			select {
			case <-ctx.Done():
				return fmt.Errorf("context cancelled while waiting for JSON: %w", ctx.Err())
			case jsonData := <-jsonCh:
				capturedJSON = jsonData
				return nil
			}
		}),
	)

	if err != nil {
		return "", fmt.Errorf("chromedp run failed: %w", err)
	}

	if capturedJSON == "" {
		return "", fmt.Errorf("failed to capture JSON data")
	}

	var result Result
	err = json.Unmarshal([]byte(capturedJSON), &result)
	if err != nil {
		log.Fatal("Error parsing json")
	}

	var userScores []UserScore
	for _, score := range result.Scores {
		userScores = append(userScores, UserScore{
			Name:  score.Name,
			Score: score.Score,
		})
	}

	simplifiedJson, err := json.Marshal(userScores)
	if err != nil {
		log.Fatal("Error marshaling simplified data:", err)
	}

	return string(simplifiedJson), nil
}
