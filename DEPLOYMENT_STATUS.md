# AWS Amplify Deployment Troubleshooting

## Problem
Server is returning `csvData` instead of `pdfData` despite code being updated and pushed to GitHub.

## Latest Commits Pushed
- `5749a48` - Add GET method to submit-application for deployment verification
- `64fe4af` - Add deployment-check endpoint to verify new code is live
- `d498aee` - FORCE DEPLOYMENT: Add version identifiers and logging
- `e29c0b5` - Fix lint errors: replace any types with proper types
- `7140752` - CRITICAL: Clear Next.js build cache to force fresh deployment

## What to Check in AWS Amplify Console

### 1. Build Status
- Go to: AWS Amplify Console → Your App → Build History
- Check if commit `5749a48` appears in the build list
- Look for:
  - ✅ Build succeeded (green)
  - ❌ Build failed (red) - check logs
  - ⏳ Build in progress (yellow)
  - ⚠️ No build triggered

### 2. If Build Failed
Check build logs for:
- TypeScript compilation errors
- Missing environment variables
- Dependency installation issues
- Build timeout

### 3. If No Build Triggered
- Check App Settings → General → Repository
- Verify branch is set to `main`
- Check if "Auto deploy" is enabled
- Manually trigger: "Redeploy this version" or "Start new build"

### 4. If Build Succeeded But Code Not Updated
- Check if CloudFront cache needs clearing
- Verify deployment completed (not just build)
- Check if there's a manual approval step

## Test Commands

Once deployment completes, test with:

```bash
# Check version
curl https://main.d3t8wpufosawhp.amplifyapp.com/api/submit-application

# Test form submission
curl -X POST https://main.d3t8wpufosawhp.amplifyapp.com/api/submit-application \
  -H "Content-Type: application/json" \
  -d '{"test":"check"}'
```

Expected response should include:
- `version: "2025-11-06-03"`
- `pdfData` field (not `csvData`)

## Code Verification

The code in `src/app/api/submit-application/route.ts` correctly returns:
- `pdfData` (line 148)
- `version: '2025-11-06-03'` (line 152)
- Headers: `X-Deployment-Version: 2025-11-06-03`

The issue is AWS Amplify deployment, not the code itself.

