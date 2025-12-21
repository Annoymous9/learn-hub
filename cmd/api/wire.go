//go:build wireinject
// +build wireinject

// Package main 定义 Wire 依赖注入配置。
package main

import (
	"learn-hub/internal/controller"
	"learn-hub/internal/pkg/database"
	"learn-hub/internal/pkg/redis"
	"learn-hub/internal/repository"
	"learn-hub/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/google/wire"
)

// initializeApp 初始化应用，使用 Wire 自动生成依赖注入代码。
func initializeApp() (*gin.Engine, func(), error) {
	wire.Build(
		// 基础设施层
		database.NewDB,
		redis.NewRedisClient,

		// 数据访问层
		repository.NewUserRepository,

		// 业务逻辑层
		service.NewUserService,

		// 控制器层
		controller.NewUserController,

		// 提供 Gin 引擎
		provideGinEngine,
	)
	return nil, nil, nil
}

// provideGinEngine 提供配置好的 Gin 引擎。
func provideGinEngine(userCtrl *controller.UserController) *gin.Engine {
	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(gin.Logger())

	// 健康检查
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "LearnHub API is running",
		})
	})

	// API v1 路由组
	v1 := router.Group("/api/v1")
	{
		userCtrl.RegisterRoutes(v1)
	}

	return router
}
