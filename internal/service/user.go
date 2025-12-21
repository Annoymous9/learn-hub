// Package service 提供业务逻辑层。
package service

import (
	"errors"
	"learn-hub/internal/entity"
	"learn-hub/internal/repository"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// UserService 用户业务逻辑接口。
type UserService interface {
	GetUserByID(id uint) (*entity.User, error)
	Authenticate(username, password string) (*entity.User, error)
	CreateUser(username, password, email, role string) (*entity.User, error)
}

// userService 用户业务逻辑实现。
type userService struct {
	userRepo repository.UserRepository
}

// NewUserService 创建用户业务逻辑实例。
func NewUserService(userRepo repository.UserRepository) UserService {
	return &userService{userRepo: userRepo}
}

// GetUserByID 根据 ID 获取用户。
func (s *userService) GetUserByID(id uint) (*entity.User, error) {
	return s.userRepo.FindByID(id)
}

// Authenticate 验证用户名和密码。
func (s *userService) Authenticate(username, password string) (*entity.User, error) {
	user, err := s.userRepo.FindByUsername(username)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("用户名或密码错误")
		}
		return nil, err
	}

	// 验证密码
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, errors.New("用户名或密码错误")
	}

	return user, nil
}

// CreateUser 创建新用户。
func (s *userService) CreateUser(username, password, email, role string) (*entity.User, error) {
	// 检查用户名是否已存在
	_, err := s.userRepo.FindByUsername(username)
	if err == nil {
		return nil, errors.New("用户名已存在")
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	// 加密密码
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &entity.User{
		Username:     username,
		Email:        email,
		PasswordHash: string(hashedPassword),
		Role:         role,
		Status:       1,
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}
