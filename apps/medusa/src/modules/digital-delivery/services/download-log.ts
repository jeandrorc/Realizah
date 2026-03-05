import { MedusaService } from '@medusajs/framework/utils';
import type { DownloadLog as DownloadLogType, DownloadStats } from '@realizah/types';

class DownloadLogService extends MedusaService({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  DownloadLog: require('../models/download-log').default,
}) {
  async logDownload(
    digitalPurchaseId: string,
    digitalFileId: string,
    customerId: string,
    ipAddress: string,
    userAgent?: string,
  ): Promise<DownloadLogType> {
    const log = await this.createDownloadLogs({
      digitalPurchaseId,
      digitalFileId,
      customerId,
      ipAddress,
      userAgent,
      downloadedAt: new Date(),
    });

    return log as DownloadLogType;
  }

  async listLogs(filters?: {
    digitalPurchaseId?: string;
    digitalFileId?: string;
    customerId?: string;
  }): Promise<DownloadLogType[]> {
    const logs = await this.listDownloadLogs(filters);
    return logs as DownloadLogType[];
  }

  async getLogsByPurchase(digitalPurchaseId: string): Promise<DownloadLogType[]> {
    return this.listLogs({ digitalPurchaseId });
  }

  async getLogsByCustomer(customerId: string): Promise<DownloadLogType[]> {
    return this.listLogs({ customerId });
  }

  async getLogsByFile(digitalFileId: string): Promise<DownloadLogType[]> {
    return this.listLogs({ digitalFileId });
  }

  async getDownloadStats(): Promise<DownloadStats> {
    const logs = await this.listDownloadLogs();

    const totalDownloads = logs.length;
    const uniqueCustomers = new Set(logs.map((log) => log.customerId)).size;

    // Group by product (would need to join with files and products in real implementation)
    const downloadsByProduct: DownloadStats['downloadsByProduct'] = [];

    // Recent downloads (last 10)
    const recentDownloads = logs
      .sort((a, b) => new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime())
      .slice(0, 10)
      .map((log) => ({
        customerId: log.customerId,
        productName: 'Product', // Would need to fetch from product
        fileName: 'File', // Would need to fetch from file
        downloadedAt: log.downloadedAt,
      }));

    return {
      totalDownloads,
      uniqueCustomers,
      totalFileSize: 0, // Would need to calculate from files
      downloadsByProduct,
      recentDownloads,
    };
  }

  async getCustomerDownloadCount(customerId: string): Promise<number> {
    const logs = await this.getLogsByCustomer(customerId);
    return logs.length;
  }

  async getPurchaseDownloadCount(digitalPurchaseId: string): Promise<number> {
    const logs = await this.getLogsByPurchase(digitalPurchaseId);
    return logs.length;
  }

  async detectSuspiciousActivity(digitalPurchaseId: string): Promise<{
    isSuspicious: boolean;
    reasons: string[];
  }> {
    const logs = await this.getLogsByPurchase(digitalPurchaseId);

    const reasons: string[] = [];

    // Check for multiple IPs
    const uniqueIps = new Set(logs.map((log) => log.ipAddress));
    if (uniqueIps.size > 3) {
      reasons.push(`Downloads from ${uniqueIps.size} different IP addresses`);
    }

    // Check for rapid downloads
    const sortedLogs = logs.sort(
      (a, b) => new Date(a.downloadedAt).getTime() - new Date(b.downloadedAt).getTime(),
    );

    for (let i = 1; i < sortedLogs.length; i++) {
      const timeDiff =
        new Date(sortedLogs[i].downloadedAt).getTime() -
        new Date(sortedLogs[i - 1].downloadedAt).getTime();

      // Less than 1 minute between downloads
      if (timeDiff < 60 * 1000) {
        reasons.push('Rapid consecutive downloads detected');
        break;
      }
    }

    return {
      isSuspicious: reasons.length > 0,
      reasons,
    };
  }
}

export default DownloadLogService;
