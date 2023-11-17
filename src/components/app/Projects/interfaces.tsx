export interface GrapesjsPage {
    name: string,
    html: string,
    style: string,
    ext_js: Array<string>,
    ext_css: Array<string>
}
export interface GrapesjsContext {
    pages: Array<GrapesjsPage>
}
export type GrapesjsProject = {
    id: string,
    name: string,
    public: string,
    tags: Array<string>,
    description: string,
    context: GrapesjsContext
}