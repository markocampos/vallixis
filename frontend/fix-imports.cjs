const fs = require('fs')

function addImport(file, imp) {
  let content = fs.readFileSync(file, 'utf8')
  if (!content.includes(imp)) {
    content = imp + '\n' + content
  }
  fs.writeFileSync(file, content)
}

addImport('./src/components/WizardStep4.tsx', "import React from 'react'")
addImport('./src/main.tsx', "import React from 'react'")
addImport('./src/pages/dashboard/WizardReal.tsx', "import React from 'react'")
addImport('./src/pages/dashboard/DashboardSupport.tsx', "import React, { useState } from 'react'")
addImport('./src/pages/dashboard/Settings.tsx', "import React, { useState } from 'react'")
addImport('./src/pages/dashboard/SitesList.tsx', "import React, { useState } from 'react'")
