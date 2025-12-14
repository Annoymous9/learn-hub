// Package main 是 LearnHub API 服务的入口点。
// 负责加载配置、初始化依赖并启动 HTTP 服务器。
package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

func main() {
	// 加载配置
	if err := loadConfig(); err != nil {
		log.Fatalf("加载配置失败: %v", err)
	}

	// 设置 Gin 模式
	gin.SetMode(viper.GetString("server.mode"))

	// 创建 Gin 引擎
	router := setupRouter()

	// 创建 HTTP 服务器
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", viper.GetInt("server.port")),
		Handler:      router,
		ReadTimeout:  viper.GetDuration("server.read_timeout"),
		WriteTimeout: viper.GetDuration("server.write_timeout"),
	}

	// 启动服务器 (非阻塞)
	go func() {
		log.Printf("LearnHub API 服务启动于 http://localhost:%d", viper.GetInt("server.port"))
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("HTTP 服务器错误: %v", err)
		}
	}()

	// 优雅关闭
	gracefulShutdown(srv)
}

// loadConfig 使用 Viper 加载配置文件。
// 支持从 configs/ 目录和环境变量读取配置。
func loadConfig() error {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./configs")
	viper.AddConfigPath(".")

	// 允许环境变量覆盖配置
	viper.AutomaticEnv()

	// 设置默认值
	viper.SetDefault("server.port", 8080)
	viper.SetDefault("server.mode", "debug")
	viper.SetDefault("server.read_timeout", "30s")
	viper.SetDefault("server.write_timeout", "30s")

	if err := viper.ReadInConfig(); err != nil {
		var configFileNotFoundError viper.ConfigFileNotFoundError
		if errors.As(err, &configFileNotFoundError) {
			log.Println("警告: 未找到配置文件，使用默认值")
			return nil
		}
		return fmt.Errorf("读取配置文件失败: %w", err)
	}

	log.Printf("已加载配置文件: %s", viper.ConfigFileUsed())
	return nil
}

// setupRouter 创建并配置 Gin 路由引擎。
// 这里注册所有中间件和路由组。
func setupRouter() *gin.Engine {
	router := gin.New()

	// 使用 Recovery 中间件防止 panic 崩溃
	router.Use(gin.Recovery())

	// 使用 Logger 中间件记录请求日志
	router.Use(gin.Logger())

	// 健康检查端点
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "LearnHub API is running",
		})
	})

	// API v1 路由组
	v1 := router.Group("/api/v1")
	{
		// TODO: 在此处注册各模块的路由
		// 示例: notes.RegisterRoutes(v1)
		_ = v1 // 避免未使用变量警告
	}

	return router
}

// gracefulShutdown 处理优雅关闭逻辑。
// 监听系统信号并在收到 SIGINT/SIGTERM 时平滑关闭服务器。
func gracefulShutdown(srv *http.Server) {
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("正在关闭服务器...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("服务器强制关闭: %v", err)
	}

	log.Println("服务器已优雅退出")
}
