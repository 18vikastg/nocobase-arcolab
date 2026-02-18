/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { MockServer, createMockServer } from '@nocobase/test';

describe('PharmaImageCapturePlugin Server', () => {
  let app: MockServer;

  beforeAll(async () => {
    app = await createMockServer({
      plugins: ['pharma-image-capture'],
    });
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('registers imageCaptureAudit collection', () => {
    const col = app.db.getCollection('imageCaptureAudit');
    expect(col).toBeDefined();
    expect(col.getField('attachmentId')).toBeTruthy();
    expect(col.getField('capturedAt')).toBeTruthy();
    expect(col.getField('imageHash')).toBeTruthy();
    expect(col.getField('barcode')).toBeTruthy();
    expect(col.getField('latitude')).toBeTruthy();
    expect(col.getField('metadata')).toBeTruthy();
  });

  it('registers imageCapture field type', () => {
    expect(app.db.fieldTypes.get('imageCapture')).toBeTruthy();
  });

  it('creates audit record via API', async () => {
    const agent = app.agent();
    const res = await agent.resource('imageCaptureAudit').create({
      values: {
        attachmentId: 999,
        capturedAt: '2026-02-17T10:00:00Z',
        capturedByName: 'Test User',
        latitude: 40.7128,
        longitude: -74.006,
        barcode: 'LOT-2026-A001',
        imageHash: 'abc123',
        captureIndex: 1,
      },
    });
    expect(res.status).toBe(200);
  });

  it('prevents deletion of audit records', async () => {
    const repo = app.db.getRepository('imageCaptureAudit');
    const rec = await repo.create({
      values: {
        attachmentId: 1000,
        capturedAt: new Date().toISOString(),
        serverTimestamp: new Date().toISOString(),
        capturedByName: 'Test',
        imageHash: 'h',
      },
    });
    await expect(repo.destroy({ filterByTk: rec.get('id') })).rejects.toThrow(/Compliance Violation/);
  });

  it('prevents modification of immutable audit fields', async () => {
    const repo = app.db.getRepository('imageCaptureAudit');
    const rec = await repo.create({
      values: {
        attachmentId: 1001,
        capturedAt: new Date().toISOString(),
        serverTimestamp: new Date().toISOString(),
        capturedByName: 'Test2',
        imageHash: 'original',
      },
    });
    await expect(repo.update({ filterByTk: rec.get('id'), values: { imageHash: 'tampered' } })).rejects.toThrow(
      /Compliance Violation/,
    );
  });
});
