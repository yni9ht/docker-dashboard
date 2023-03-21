package api

import (
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
	"github.com/gin-gonic/gin"
)

type ImageAPI struct {
	client *client.Client
}

func (i *ImageAPI) ListImage(context *gin.Context) {
	options := types.ImageListOptions{}
	images, err := i.client.ImageList(context, options)
	if err != nil {
		_ = context.Error(err)
		return
	}
	context.JSON(200, images)
}

func NewImageAPI(client *client.Client) *ImageAPI {
	return &ImageAPI{client: client}
}
