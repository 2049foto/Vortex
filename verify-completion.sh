#!/bin/bash
# VORTEX PROTOCOL - COMPLETION VERIFICATION SCRIPT
# Verifies all contract requirements are met

PASS=0
FAIL=0

echo "=== VORTEX S++ COMPLETION VERIFICATION ==="
echo ""

# 1. File existence (10 files minimum)
echo "1. Checking file existence..."
[ -f packages/frontend/src/lib/scanner/scanner.ts ] && ((PASS++)) && echo "  ✅ scanner.ts" || ((FAIL++)) && echo "  ❌ scanner.ts"
[ -f packages/frontend/src/lib/scanner/classifier.ts ] && ((PASS++)) && echo "  ✅ classifier.ts" || ((FAIL++)) && echo "  ❌ classifier.ts"
[ -f packages/frontend/src/lib/batch/swap-engine.ts ] && ((PASS++)) && echo "  ✅ swap-engine.ts" || ((FAIL++)) && echo "  ❌ swap-engine.ts"
[ -f packages/frontend/src/lib/gamification/engine.ts ] && ((PASS++)) && echo "  ✅ gamification/engine.ts" || ((FAIL++)) && echo "  ❌ gamification/engine.ts"
[ -f packages/frontend/src/components/features/TokenTable.tsx ] && ((PASS++)) && echo "  ✅ TokenTable.tsx" || ((FAIL++)) && echo "  ❌ TokenTable.tsx"
[ -f packages/frontend/src/lib/scanner/rpc-scanner.ts ] && ((PASS++)) && echo "  ✅ rpc-scanner.ts" || ((FAIL++)) && echo "  ❌ rpc-scanner.ts"
[ -f packages/frontend/src/lib/batch/hide-burn.ts ] && ((PASS++)) && echo "  ✅ hide-burn.ts" || ((FAIL++)) && echo "  ❌ hide-burn.ts"
[ -f packages/frontend/src/lib/cache/redis-client.ts ] && ((PASS++)) && echo "  ✅ redis-client.ts" || ((FAIL++)) && echo "  ❌ redis-client.ts"
[ -f packages/frontend/src/components/ErrorBoundary.tsx ] && ((PASS++)) && echo "  ✅ ErrorBoundary.tsx" || ((FAIL++)) && echo "  ❌ ErrorBoundary.tsx"
[ -f packages/backend/src/api/health/health.ts ] && ((PASS++)) && echo "  ✅ health.ts" || ((FAIL++)) && echo "  ❌ health.ts"

echo ""

# 2. Test count (50+ tests)
echo "2. Checking test count..."
TEST_COUNT=$(find packages -name "*.test.ts" -o -name "*.test.tsx" | grep -v node_modules | wc -l)
if [ $TEST_COUNT -ge 50 ]; then
  ((PASS++))
  echo "  ✅ Test files: $TEST_COUNT (required: 50+)"
else
  ((FAIL++))
  echo "  ❌ Test files: $TEST_COUNT (required: 50+)"
fi

echo ""

# 3. Build success
echo "3. Checking build..."
cd packages/frontend
if bun run build >/dev/null 2>&1; then
  ((PASS++))
  echo "  ✅ Frontend build successful"
else
  ((FAIL++))
  echo "  ❌ Frontend build failed"
fi
cd ../..

cd packages/backend
if bun run build >/dev/null 2>&1; then
  ((PASS++))
  echo "  ✅ Backend build successful"
else
  ((FAIL++))
  echo "  ❌ Backend build failed"
fi
cd ../..

echo ""

# 4. Bundle size check
echo "4. Checking bundle size..."
if [ -d packages/frontend/dist ]; then
  BUNDLE_SIZE=$(du -sb packages/frontend/dist | awk '{print $1}')
  if [ $BUNDLE_SIZE -lt 5120000 ]; then
    ((PASS++))
    echo "  ✅ Bundle size: $(($BUNDLE_SIZE / 1024))KB (limit: 5MB)"
  else
    ((FAIL++))
    echo "  ❌ Bundle size: $(($BUNDLE_SIZE / 1024))KB (exceeds 5MB limit)"
  fi
else
  ((FAIL++))
  echo "  ❌ dist/ folder not found"
fi

echo ""

# 5. TypeScript check
echo "5. Checking TypeScript..."
cd packages/frontend
if bun run type-check >/dev/null 2>&1; then
  ((PASS++))
  echo "  ✅ Frontend TypeScript check passed"
else
  ((FAIL++))
  echo "  ❌ Frontend TypeScript errors found"
fi
cd ../..

echo ""

# 6. Database models (8 models)
echo "6. Checking database models..."
MODEL_COUNT=$(grep -c "^model " packages/backend/prisma/schema.prisma 2>/dev/null || echo "0")
if [ $MODEL_COUNT -ge 8 ]; then
  ((PASS++))
  echo "  ✅ Prisma models: $MODEL_COUNT (required: 8+)"
else
  ((FAIL++))
  echo "  ❌ Prisma models: $MODEL_COUNT (required: 8+)"
fi

echo ""

# Summary
echo "=== VERIFICATION SUMMARY ==="
echo "PASS: $PASS"
echo "FAIL: $FAIL"
echo ""

if [ $FAIL -eq 0 ]; then
  echo "✅ S++ STATUS ACHIEVED!"
  echo "All requirements met. Ready for production deployment."
  exit 0
else
  echo "❌ INCOMPLETE - Missing $FAIL criteria"
  echo "Please fix the issues above before deployment."
  exit 1
fi

