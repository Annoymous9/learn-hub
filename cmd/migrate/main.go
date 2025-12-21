// Package main 提供数据库迁移和初始化工具。
// 使用 GORM AutoMigrate 创建表结构并初始化管理员用户。
package main

import (
	"flag"
	"fmt"
	"learn-hub/internal/entity"
	"learn-hub/internal/pkg/database"
	"log"

	"github.com/spf13/viper"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	// 命令行参数
	adminPassword := flag.String("admin-password", "Admin@123", "管理员用户密码")
	flag.Parse()

	// 加载配置
	if err := loadConfig(); err != nil {
		log.Fatalf("加载配置失败: %v", err)
	}

	// 连接数据库
	db, err := database.NewDB()
	if err != nil {
		log.Fatalf("数据库连接失败: %v", err)
	}
	sqlDB, _ := db.DB()
	defer sqlDB.Close()

	log.Println("开始数据库迁移...")

	// 自动迁移表结构
	if err := db.AutoMigrate(
		&entity.User{},
		// 后续添加其他实体
	); err != nil {
		log.Fatalf("自动迁移失败: %v", err)
	}

	log.Println("✓ 表结构迁移完成")

	// 检查是否已存在 admin 用户
	var count int64
	db.Model(&entity.User{}).Where("username = ?", "admin").Count(&count)
	if count > 0 {
		log.Println("⚠ admin 用户已存在，跳过创建")
		return
	}

	// 创建管理员用户
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(*adminPassword), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("密码加密失败: %v", err)
	}

	admin := &entity.User{
		Username:     "admin",
		Email:        "admin@learnhub.local",
		PasswordHash: string(hashedPassword),
		Role:         "admin",
		Status:       1,
	}

	if err := db.Create(admin).Error; err != nil {
		log.Fatalf("创建管理员用户失败: %v", err)
	}

	log.Printf("✓ 管理员用户创建成功")
	log.Printf("  用户名: admin")
	log.Printf("  密码: %s", *adminPassword)
	log.Printf("  邮箱: admin@learnhub.local")
	log.Println("\n数据库初始化完成！")
}

// loadConfig 加载配置文件。
func loadConfig() error {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./configs")
	viper.AddConfigPath("../../configs") // 从 cmd/migrate 运行时的路径
	viper.AutomaticEnv()

	// 设置默认值
	viper.SetDefault("database.host", "localhost")
	viper.SetDefault("database.port", 3306)
	viper.SetDefault("database.charset", "utf8mb4")
	viper.SetDefault("database.parse_time", true)
	viper.SetDefault("database.max_idle_conns", 10)
	viper.SetDefault("database.max_open_conns", 100)
	viper.SetDefault("database.conn_max_lifetime", "1h")

	if err := viper.ReadInConfig(); err != nil {
		return fmt.Errorf("读取配置文件失败: %w", err)
	}

	log.Printf("已加载配置文件: %s", viper.ConfigFileUsed())
	return nil
}
