const fs = require('fs')
const path = require('path')

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f)
    let isDirectory = fs.statSync(dirPath).isDirectory()
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f))
  })
}

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8')
    // Remove standalone React imports
    content = content.replace(/^import React from 'react'\n/gm, '')
    // Replace unused variables
    if (filePath.includes('Pricing.tsx')) {
      content = content.replace(/import React, \{ useState \} from 'react'/, "import React from 'react'")
      content = content.replace(/, FOUNDER_PRICE, formatPHP/, "")
      content = content.replace(/const \[showFounder, setShowFounder\] = useState\(false\)\n/, "")
    }
    if (filePath.includes('Support.tsx')) {
      content = content.replace(/, Mail, Clock/, "")
    }
    if (filePath.includes('WizardDemo.tsx')) {
      content = content.replace(/import React, \{ useState \} from 'react'/, "")
      content = content.replace(/, reset/, "")
    }
    if (filePath.includes('Register.tsx')) {
      content = content.replace(/const \[searchParams\] = useSearchParams\(\)\n/, "")
    }
    if (filePath.includes('Billing.tsx')) {
      content = content.replace(/, formatPHP/, "")
    }
    if (filePath.includes('Settings.tsx')) {
      content = content.replace(/import React, \{ useState \} from 'react'/, "import React from 'react'")
      content = content.replace(/, Bell/, "")
      content = content.replace(/, logout/, "")
    }
    if (filePath.includes('DashboardSupport.tsx') || filePath.includes('SitesList.tsx')) {
      content = content.replace(/import React, \{ useState \} from 'react'/, "import React from 'react'")
    }
    if (filePath.includes('SiteEditor.tsx')) {
      content = content.replace(/const \{ id \} = useParams/g, "// const { id } = useParams")
    }
    if (filePath.includes('WizardReal.tsx')) {
      content = content.replace(/, businessName, description, vibe, template, domainSlug/, "")
    }
    fs.writeFileSync(filePath, content)
  }
})
console.log('Cleanup done')
