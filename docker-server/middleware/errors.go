package middleware

import "github.com/gin-gonic/gin"

func ErrorMiddleware(c *gin.Context) {
	c.Next()
	if len(c.Errors) > 0 {
		c.AbortWithStatusJSON(500, c.Errors[0])
	}
}
