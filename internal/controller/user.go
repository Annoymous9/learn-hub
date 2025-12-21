// Package controller 提供 HTTP 控制器。
package controller

import (
	"learn-hub/internal/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// UserController 用户控制器。
type UserController struct {
	userService service.UserService
}

// NewUserController 创建用户控制器实例。
func NewUserController(userService service.UserService) *UserController {
	return &UserController{userService: userService}
}

// GetUserByID 获取用户信息。
// GET /api/v1/users/:id
func (c *UserController) GetUserByID(ctx *gin.Context) {
	idParam := ctx.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": gin.H{
				"code":    "INVALID_PARAMETER",
				"message": "无效的用户 ID",
			},
		})
		return
	}

	user, err := c.userService.GetUserByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": gin.H{
				"code":    "RESOURCE_NOT_FOUND",
				"message": "用户不存在",
			},
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": user,
	})
}

// RegisterRoutes 注册用户相关路由。
func (c *UserController) RegisterRoutes(rg *gin.RouterGroup) {
	users := rg.Group("/users")
	{
		users.GET("/:id", c.GetUserByID)
		// TODO: 添加更多路由
	}
}
