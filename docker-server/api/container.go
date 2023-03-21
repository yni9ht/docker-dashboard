package api

import (
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/client"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

type ContainerAPI struct {
	client *client.Client
}

type Container struct {
	ID      string   `json:"id"`
	Names   []string `json:"names"`
	Image   string   `json:"image"`
	ImageID string   `json:"image_id"`
	State   string   `json:"state"`
	Status  string   `json:"status"`
	Created int64    `json:"created"`
}

type CreateContainerReq struct {
	Name  string `json:"name"`
	Image string `json:"image"`
}

func (c *ContainerAPI) ListContainer(context *gin.Context) {
	options := types.ContainerListOptions{}
	containers, err := c.client.ContainerList(context, options)
	if err != nil {
		log.Printf("Error listing containers: %s \n", err)
		_ = context.Error(err)
		return
	}

	result := make([]Container, 0, len(containers))
	for _, container := range containers {
		result = append(result, Container{
			ID:      container.ID,
			Names:   container.Names,
			Image:   container.Image,
			ImageID: container.ImageID,
			State:   container.State,
			Status:  container.Status,
			Created: container.Created,
		})
	}

	context.JSON(200, result)
}

func (c *ContainerAPI) GetContainer(context *gin.Context) {
	id := context.Param("id")
	containerRes, err := c.client.ContainerInspect(context, id)
	if err != nil {
		log.Printf("Error getting container: %s \n", err)
		_ = context.Error(err)
		return
	}

	context.JSON(200, containerRes)
}

func (c *ContainerAPI) DeleteContainer(context *gin.Context) {
	id := context.Param("id")
	log.Printf("Removing container: %s \n", id)
	options := types.ContainerRemoveOptions{
		Force: true,
	}
	err := c.client.ContainerRemove(context, id, options)
	if err != nil {
		log.Printf("Error removing container: %s \n", err)
		_ = context.Error(err)
		return
	}
	context.Status(http.StatusNoContent)
}

func (c *ContainerAPI) CreateContainer(context *gin.Context) {
	req := &CreateContainerReq{}
	if err := context.ShouldBindJSON(req); err != nil {
		log.Printf("Error binding request: %s \n", err)
		_ = context.Error(err)
		return
	}
	containerName := req.Name
	config := &container.Config{
		Image: req.Image,
	}
	hostConfig := &container.HostConfig{}
	networkingConfig := &network.NetworkingConfig{}

	containerRes, err := c.client.ContainerCreate(context, config, hostConfig, networkingConfig, nil, containerName)
	if err != nil {
		log.Printf("Error creating container: %s \n", err)
		_ = context.Error(err)
		return
	}

	err = c.client.ContainerStart(context, containerRes.ID, types.ContainerStartOptions{})
	if err != nil {
		log.Printf("Error starting container: %s \n", err)
		_ = context.Error(err)
		return
	}
	context.Status(http.StatusCreated)
}

func NewContainerAPI(client *client.Client) *ContainerAPI {
	return &ContainerAPI{client: client}
}
