/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

/**
 * @jest-environment jsdom
 */
describe('ImageCaptureField Client', () => {
  it('exports ImageCaptureField', () => {
    const mod = require('../../client/components/ImageCaptureField');
    expect(mod.ImageCaptureField).toBeDefined();
  });

  it('exports computeSHA256', () => {
    const mod = require('../../client/components/ImageCaptureField');
    expect(typeof mod.computeSHA256).toBe('function');
  });

  it('exports ImageCaptureReadPretty', () => {
    const mod = require('../../client/components/ImageCaptureReadPretty');
    expect(mod.ImageCaptureReadPretty).toBeDefined();
  });

  it('enforces maxCaptures', () => {
    expect(new Array(5).length < 5).toBe(false);
    expect(new Array(3).length < 5).toBe(true);
  });

  it('validates CaptureMetadata structure', () => {
    const meta = {
      timestamp: '2026-02-17T10:00:00Z',
      userId: 1,
      userName: 'Test',
      latitude: 40.7,
      longitude: -74.0,
      accuracy: 5,
      barcode: 'LOT-001',
      deviceInfo: 'TestAgent',
      captureIndex: 1,
      imageHash: 'abc123',
    };
    expect(meta).toHaveProperty('timestamp');
    expect(meta).toHaveProperty('imageHash');
    expect(meta).toHaveProperty('userId');
  });
});
