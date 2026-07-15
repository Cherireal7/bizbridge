import { env } from '../env.js'

export class R2Service {
  private get configured() {
    return Boolean(
      env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY && env.R2_BUCKET_NAME && env.R2_ENDPOINT,
    )
  }

  async createPresignedDownloadUrl(_key: string, _expiresInSeconds = 300): Promise<string> {
    if (!this.configured) throw new Error('R2 not configured')
    throw new Error('R2Service.createPresignedDownloadUrl not implemented — Phase 2')
  }

  async createPresignedUploadUrl(
    _key: string,
    _contentType: string,
    _expiresInSeconds = 300,
  ): Promise<string> {
    if (!this.configured) throw new Error('R2 not configured')
    throw new Error('R2Service.createPresignedUploadUrl not implemented — Phase 2')
  }
}

export const r2Service = new R2Service()
