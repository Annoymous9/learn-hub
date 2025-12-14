---
trigger: always_on
---

# 数据库设计规范 (Database Schema)

## 1. 基础规范
- **数据库**: MySQL 8.0。
- **引擎**: InnoDB, 字符集 `utf8mb4_0900_ai_ci`。
- **ORM**: GORM v2。
- **字段命名**: Go 结构体使用 PascalCase，数据库表列名自动转换为 snake_case。
- **通用字段**: 所有核心实体表必须包含 `ID` (uint, AutoIncrement), `CreatedAt` (time), `UpdatedAt` (time)。
- **JSON 支持**: 复杂配置和非结构化数据（如选项、规则、元数据）使用 JSON 类型存储，Go 端定义为 `gorm:"type:json"` 或使用 `datatypes.JSON`。

## 2. 核心模型定义
以下是核心实体的定义要求：

### A. 用户与权限 (Users & Auth)
- **User**:
  - 字段: `Username` (unique), `Email`, `PasswordHash`, `Role` (enum: admin, user), `Status`。
  - 索引: `LastLoginAt`。
- **AuditLog**:
  - 记录敏感操作。
  - 字段: `UserID`, `Action`, `Resource`, `IP`, `UA`。

### B. 笔记系统 (Notes)
- **Notebook**:
  - 字段: `Name`, `ParentID` (自引用), `OwnerID`。
- **Note**:
  - 字段: `Title`, `ContentMD` (MediumText), `ContentHTML`, `NotebookID`, `OwnerID`。
  - 关联: HasMany `Tags` (NoteTag), HasMany `Attachments`.
- **NoteTag**:
  - 字段: `NoteID`, `Tag`. 唯一索引 `(note_id, tag)`。
- **Attachment**:
  - 字段: `NoteID` (nullable), `OwnerID`, `FilePath`, `FileType`, `Size`, `Meta` (JSON)。

### C. OCR 服务 (OCR)
- **OCRJob**:
  - 字段: `OwnerID`, `SourceAttachmentID`, `Status` (queued, running, succeeded, failed), `Engine` (local, cloud)。
  - 结果: `ResultText` (LongText), `LayoutJSON` (JSON), `TablesCSVPath`。
  - 必须记录 `FinishedAt` 和 `Error` 信息。

### D. 题库与考试 (Exams)
- **Question**:
  - 字段: `Type` (enum: single, multi, blank...), `StemMD`, `OptionsJSON`, `AnswerJSON`, `ExplanationMD`, `Difficulty`, `StatsCorrectRate`。
  - 标签: 多对多或一对多 `QuestionKnowledgeTags`。
- **Exam**:
  - 字段: `Title`, `ConfigJSON` (包含时长、乱序规则、配额)。
- **ExamPaper**:
  - 试卷快照。
  - 字段: `ExamID`, `QuestionIDs` (JSON, 存储题目ID列表), `ScoreRulesJSON`。
- **ExamRecord**:
  - 答题记录。
  - 字段: `ExamID`, `UserID`, `PaperID`, `AnswersJSON` (用户答案), `AutoScore`, `ManualScore`, `WrongListIDs` (JSON, 错题ID集合)。

### E. 日程与待办 (Tasks & Events)
- **Project**: 清单/项目容器。
- **Task**:
  - 字段: `ProjectID`, `Title`, `DescMD`, `Status` (todo, doing, done), `Priority`, `DueAt`, `ReminderRules` (JSON), `PomodoroCount`。
- **Event**:
  - 字段: `Title`, `StartAt`, `EndAt`, `RepeatRule` (JSON, RRule格式)。

### F. 监控 (Monitor)
- **Monitor**:
  - 字段: `Type` (http, ping, tcp...), `Target`, `ConfigJSON` (期望Code, 关键词), `IntervalSec`。
- **ProbeResult**:
  - 时序数据，建议定期清理。
  - 字段: `MonitorID`, `LatencyMS`, `Status` (up/down), `Message`.

## 3. 关键关系约束
- **行级隔离**: 所有业务表（除了 `Users` 和 `AuditLogs`）必须包含 `OwnerID` 字段，并建立外键关联 `users(id)`。
- **级联删除**:
  - 删除 `Notebook` -> 级联删除子笔记不强制（可设为默认笔记本），视业务逻辑而定。
  - 删除 `Note` -> 级联删除 `NoteTags`。
  - 删除 `Exam` -> 级联删除 `ExamPapers`。

## 4. GORM 示例代码风格
```go
type Note struct {
    gorm.Model // ID, CreatedAt, UpdatedAt, DeletedAt
    Title      string `gorm:"type:varchar(255);not null"`
    ContentMD  string `gorm:"type:mediumtext"`
    OwnerID    uint   `gorm:"index;not null"`
    Owner      User   `gorm:"foreignKey:OwnerID"`
    // ...
}