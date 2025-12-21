// Package repository 提供数据访问层接口和实现。
package repository

import (
	"learn-hub/internal/entity"

	"gorm.io/gorm"
)

// UserRepository 用户数据访问接口。
type UserRepository interface {
	FindByID(id uint) (*entity.User, error)
	FindByUsername(username string) (*entity.User, error)
	Create(user *entity.User) error
	Update(user *entity.User) error
}

// userRepository 用户数据访问实现。
type userRepository struct {
	db *gorm.DB
}

// NewUserRepository 创建用户数据访问层实例。
func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

// FindByID 根据 ID 查询用户。
func (r *userRepository) FindByID(id uint) (*entity.User, error) {
	var user entity.User
	if err := r.db.First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// FindByUsername 根据用户名查询用户。
func (r *userRepository) FindByUsername(username string) (*entity.User, error) {
	var user entity.User
	if err := r.db.Where("username = ?", username).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// Create 创建用户。
func (r *userRepository) Create(user *entity.User) error {
	return r.db.Create(user).Error
}

// Update 更新用户。
func (r *userRepository) Update(user *entity.User) error {
	return r.db.Save(user).Error
}
