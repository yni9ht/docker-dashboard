package main

import (
	"github.com/docker/docker/client"
	"github.com/gin-gonic/gin"
	"github.com/yni9ht/docker-server/api"
	"github.com/yni9ht/docker-server/middleware"
)

func main() {
	r := gin.Default()
	r.Use(middleware.ErrorMiddleware)

	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		panic(err)
	}
	defer func(cli *client.Client) {
		_ = cli.Close()
	}(cli)

	containerAPI := api.NewContainerAPI(cli)
	imageAPI := api.NewImageAPI(cli)

	r.GET("/containers", containerAPI.ListContainer)
	r.POST("/containers", containerAPI.CreateContainer)
	r.GET("/container/:id", containerAPI.GetContainer)
	r.DELETE("/container/:id", containerAPI.DeleteContainer)

	r.GET("/images", imageAPI.ListImage)
	// listen and serve on 0.0.0.0:8080

	if err := r.Run(); err != nil {
		panic(err)
	}
}
