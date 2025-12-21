// Package entity 定义数据库实体模型。
package entity

import (
	"gorm.io/gorm"
)

// User 用户实体模型。
type User struct {
	gorm.Model
	Username     string          `gorm:"type:varchar(50);uniqueIndex;not null" json:"username"`
	Email        string          `gorm:"type:varchar(100);index" json:"email"`
	PasswordHash string          `gorm:"type:varchar(255);not null" json:"-"`
	Role         string          `gorm:"type:varchar(20);not null;default:'user'" json:"role"` // admin, user
	Status       int             `gorm:"default:1" json:"status"`                              // 1: active, 0: disabled
	LastLoginAt  *gorm.DeletedAt `gorm:"index" json:"last_login_at"`
}

// TableName 指定表名。
func (User) TableName() string {
	return "users"
}
