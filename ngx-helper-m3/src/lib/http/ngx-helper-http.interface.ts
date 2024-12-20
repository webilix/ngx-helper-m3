export interface INgxHelperHttpUploadConfig {
    readonly method: 'POST' | 'PUT' | 'PATCH';
    readonly header: { [key: string]: any };
    readonly body: { [key: string]: any };
}
