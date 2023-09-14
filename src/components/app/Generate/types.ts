import type React from "react"

export interface TabProps extends React.PropsWithChildren {
    iframeSectionRef: React.RefObject<HTMLDivElement>
}