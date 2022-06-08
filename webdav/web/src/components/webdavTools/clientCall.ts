import { extractURLPath } from "./newDependency/url";
import { setupAuth } from "./authentication/index";
import { deleteFile } from "./webdavFunctions/deleteFile";
import { getDirectoryContents } from "./webdavFunctions/directoryContents";
import { getFileContents, getFileDownloadLink } from "./webdavFunctions/getFileContents";
import {
    AuthType,
    // BufferLike,
    // CreateReadStreamOptions,
    // CreateWriteStreamCallback,
    // CreateWriteStreamOptions,
    GetDirectoryContentsOptions,
    GetFileContentsOptions,
    // GetQuotaOptions,
    // Headers,
    // LockOptions,
    // PutFileContentsOptions,
    // RequestOptionsCustom,
    // StatOptions,
    WebDAVClient,
    WebDAVClientContext,
    WebDAVClientOptions,
    WebDAVMethodOptions
} from "./types";

const DEFAULT_CONTACT_HREF =
    "";

export function createClient(remoteURL: string, options: WebDAVClientOptions): WebDAVClient {
    const {
        authType: authTypeRaw = null,
        contactHref = DEFAULT_CONTACT_HREF,
        headers = {},
        httpAgent,
        httpsAgent,
        maxBodyLength,
        maxContentLength,
        password,
        token,
        username,
        withCredentials
    } = options;
    let authType = authTypeRaw;
    if (!authType) {
        authType = username || password ? AuthType.Password : AuthType.None;
    }
    const context: WebDAVClientContext = {
        authType,
        contactHref,
        headers: Object.assign({}, headers),
        httpAgent,
        httpsAgent,
        maxBodyLength,
        maxContentLength,
        remotePath: extractURLPath(remoteURL),
        remoteURL,
        password,
        token,
        username,
        withCredentials
    };
    setupAuth(context, username, password, token);
    return {
        deleteFile: (filename: string, options?: WebDAVMethodOptions) =>
            deleteFile(context, filename, options),
        getDirectoryContents: (path: string, options?: GetDirectoryContentsOptions) =>
            getDirectoryContents(context, path, options),
        getFileContents: (filename: string, options?: GetFileContentsOptions) =>
            getFileContents(context, filename, options),
        getFileDownloadLink: (filename: string) => getFileDownloadLink(context, filename),
    };
}
