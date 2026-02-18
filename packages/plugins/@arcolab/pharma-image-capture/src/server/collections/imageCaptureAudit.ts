/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { defineCollection } from '@nocobase/database';

export default defineCollection({
  name: 'imageCaptureAudit',
  title: 'Image Capture Audit Trail',
  shared: true,
  createdBy: true,
  updatedBy: true,
  dumpRules: 'required',
  migrationRules: ['overwrite', 'schema-only'],
  fields: [
    { type: 'bigInt', name: 'id', primaryKey: true, autoIncrement: true },
    { type: 'bigInt', name: 'attachmentId', index: true, comment: 'FK to attachments' },
    { type: 'string', name: 'capturedAt', comment: 'Client ISO 8601 timestamp' },
    { type: 'string', name: 'serverTimestamp', comment: 'Server ISO 8601 timestamp' },
    { type: 'bigInt', name: 'capturedById', index: true, comment: 'User ID' },
    { type: 'string', name: 'capturedByName', comment: 'User display name at capture time' },
    { type: 'float', name: 'latitude', comment: 'GPS latitude' },
    { type: 'float', name: 'longitude', comment: 'GPS longitude' },
    { type: 'float', name: 'accuracy', comment: 'GPS accuracy (meters)' },
    { type: 'string', name: 'barcode', comment: 'Scanned barcode/QR value' },
    { type: 'text', name: 'deviceInfo', comment: 'Device/browser info' },
    { type: 'integer', name: 'captureIndex', comment: '1-based sequence number' },
    { type: 'string', name: 'imageHash', comment: 'SHA-256 of captured image' },
    { type: 'string', name: 'action', defaultValue: 'CAPTURE', comment: 'CAPTURE | CAPTURE_AUTO' },
    { type: 'jsonb', name: 'metadata', defaultValue: {}, comment: 'Extended metadata JSON' },
  ],
});
