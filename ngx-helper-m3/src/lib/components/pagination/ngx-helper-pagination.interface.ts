export interface INgxHelperPagination {
    readonly route?: string[];
    readonly item?: { title: string; total: number };
    readonly page: { current: number; total: number };
}
