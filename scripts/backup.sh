#!/bin/bash
# TaxSnapAI Günlük Yedekleme Scripti
# Bu script değişiklikleri commit edip GitHub'a push eder

REPO_DIR="/root/TaxSnapAI"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M")
BRANCH="main"

cd "$REPO_DIR" || exit 1

# Değişiklik var mı kontrol et
if [ -z "$(git status --porcelain)" ]; then
    echo "[$TIMESTAMP] Değişiklik yok, yedekleme atlanıyor."
    exit 0
fi

# Tüm değişiklikleri stage et
git add -A

# Commit mesajı oluştur
CHANGED_FILES=$(git diff --cached --name-only | wc -l)
git commit -m "backup: $TIMESTAMP ($CHANGED_FILES dosya değişti)"

# GitHub'a push et
git push origin "$BRANCH"

if [ $? -eq 0 ]; then
    echo "[$TIMESTAMP] ✅ Yedekleme başarılı - $CHANGED_FILES dosya push edildi."
else
    echo "[$TIMESTAMP] ❌ Push başarısız! Lütfen kontrol edin."
    exit 1
fi
