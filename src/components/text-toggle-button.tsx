'use client'

import { useState } from "react"
import { Button } from "./ui/button"
export default function TextToggleButton() {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const handleChange = () => {
    setIsExpanded((prev) => !prev);
  }
  return (
    <div>
      <Button onClick={handleChange}>
        {isExpanded ? "表示を戻す" : "すべて表示"}
      </Button>
    </div>
  )
}


