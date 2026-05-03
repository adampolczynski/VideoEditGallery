#!/bin/bash

# Quick verification that app is production-ready
set -e

echo "🔍 Production Readiness Verification"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_pass() { echo -e "${GREEN}✓ PASS${NC} - $1"; }
check_fail() { echo -e "${RED}✗ FAIL${NC} - $1"; }
check_warn() { echo -e "${YELLOW}⚠ WARN${NC} - $1"; }

echo "📋 Checking Dependencies..."
command -v node > /dev/null && check_pass "Node.js installed ($(node --version))" || check_fail "Node.js not found"
command -v npm > /dev/null && check_pass "npm installed ($(npm --version))" || check_fail "npm not found"

echo ""
echo "📁 Checking Files..."
[ -d "node_modules" ] && check_pass "node_modules directory exists" || check_fail "node_modules not found"
[ -f "package.json" ] && check_pass "package.json exists" || check_fail "package.json not found"
[ -f ".env" ] && check_pass ".env file exists" || check_warn ".env file not found"
[ -d "dist" ] && check_pass "dist/ directory exists" || check_fail "dist/ not found - run: npm run build"
[ -d "server" ] && check_pass "server/ directory exists" || check_fail "server/ not found"
[ -d "src" ] && check_pass "src/ directory exists" || check_fail "src/ not found"

echo ""
echo "🐳 Checking Docker..."
command -v docker > /dev/null && check_pass "Docker installed" || check_warn "Docker not installed (needed for Docker deployment)"
[ -f "Dockerfile" ] && check_pass "Dockerfile exists" || check_fail "Dockerfile not found"
[ -f "docker-compose.yml" ] && check_pass "docker-compose.yml exists" || check_fail "docker-compose.yml not found"
if docker compose version > /dev/null 2>&1 || command -v docker-compose > /dev/null 2>&1; then
  check_pass "Docker Compose available"
else
  check_warn "Docker Compose not installed (manual VPS deploy still available via deploy.sh)"
fi

echo ""
echo "🚀 Checking Deployment Files..."
[ -f "deploy.sh" ] && check_pass "deploy.sh exists (Linux manual deployment)" || check_warn "deploy.sh not found"
[ -f "ecosystem.config.js" ] && check_pass "ecosystem.config.js exists (PM2 config)" || check_warn "ecosystem.config.js not found"
[ -f "Makefile" ] && check_pass "Makefile exists" || check_warn "Makefile not found"

echo ""
echo "📚 Checking Documentation..."
[ -f "README.md" ] && check_pass "README.md exists" || check_fail "README.md not found"
[ -f "QUICK_DEPLOY.md" ] && check_pass "QUICK_DEPLOY.md exists" || check_warn "QUICK_DEPLOY.md not found"
[ -f "PRODUCTION_READY.md" ] && check_pass "PRODUCTION_READY.md exists" || check_warn "PRODUCTION_READY.md not found"
[ -f "PRODUCTION_DEPLOYMENT.md" ] && check_pass "PRODUCTION_DEPLOYMENT.md exists" || check_warn "PRODUCTION_DEPLOYMENT.md not found"
[ -f "PRODUCTION_CHECKLIST.md" ] && check_pass "PRODUCTION_CHECKLIST.md exists" || check_warn "PRODUCTION_CHECKLIST.md not found"

echo ""
echo "🔐 Security Checks..."
if [ -f ".env" ]; then
  if grep -q "admin123" .env; then
    check_warn "Default admin password detected in .env - MUST CHANGE BEFORE DEPLOY"
  else
    check_pass ".env uses custom admin password"
  fi
  
  if grep -q "your-secret-key-change-in-production" .env; then
    check_warn "Default JWT secret detected in .env - MUST CHANGE BEFORE DEPLOY"
  else
    check_pass ".env uses custom JWT secret"
  fi
else
  check_warn ".env file not found - will be needed for deployment"
fi

echo ""
echo "📦 Checking Node Modules..."
[ -f "node_modules/express/package.json" ] && check_pass "Express installed" || check_fail "Express not installed"
[ -f "node_modules/react/package.json" ] && check_pass "React installed" || check_fail "React not installed"
[ -f "node_modules/vite/package.json" ] && check_pass "Vite installed" || check_fail "Vite not installed"

echo ""
echo "🧪 Build Test..."
if npm run build > /dev/null 2>&1; then
  check_pass "Production build successful"
  if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    check_pass "Frontend built to dist/"
  fi
else
  check_fail "Production build failed"
fi

echo ""
echo "===================================="
echo "✅ Verification Complete!"
echo ""
echo "📖 Next Steps:"
echo "1. Review the warnings above"
echo "2. Read QUICK_DEPLOY.md for deployment instructions"
echo "3. Choose Docker or Linux manual deployment"
echo "4. Follow PRODUCTION_CHECKLIST.md before going live"
echo ""
