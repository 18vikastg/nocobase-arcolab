/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { BaseInterface } from '@nocobase/database';

export class ImageCaptureInterface extends BaseInterface {
  async toValue(value: any) {
    if (!value) return [];
    const items = Array.isArray(value) ? value : [value];
    return items.map((item: any, i: number) => {
      if (typeof item === 'string') {
        return {
          url: item,
          meta: {
            timestamp: new Date().toISOString(),
            captureIndex: i + 1,
            imageHash: '',
            userId: 0,
            userName: 'import',
            latitude: null,
            longitude: null,
            accuracy: null,
            barcode: null,
            deviceInfo: 'import',
          },
        };
      }
      return item;
    });
  }

  toString(value: any) {
    if (!value) return '';
    return (Array.isArray(value) ? value : [value])
      .map((v: any) => v?.url || '')
      .filter(Boolean)
      .join(',');
  }
}
