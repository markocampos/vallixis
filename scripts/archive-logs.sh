#!/bin/bash
# Move all log files from progress/jules to .skills/memory

# Check if there are any files to move (ignoring _INSTRUCTION.txt if you want, but we can just move .md logs which are typically the log files)
if ls progress/jules/*.md 1> /dev/null 2>&1; then
  # mv automatically removes the files from the source directory after moving them
  mv progress/jules/*.md .skills/memory/
  echo "Logs successfully moved to .skills/memory/ and removed from progress/jules/"
else
  echo "No markdown logs found in progress/jules/"
fi
