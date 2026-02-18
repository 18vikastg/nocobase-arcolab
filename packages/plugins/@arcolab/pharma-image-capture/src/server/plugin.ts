/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import path from 'path';
import { Plugin } from '@nocobase/server';
import { ImageCaptureField } from './fields/ImageCaptureField';
import { ImageCaptureInterface } from './interfaces/ImageCaptureInterface';

export class PharmaImageCapturePlugin extends Plugin {
  beforeLoad() {
    this.db.registerFieldTypes({ imageCapture: ImageCaptureField });
  }

  async load() {
    await this.importCollections(path.resolve(__dirname, 'collections'));

    this.db.interfaceManager.registerInterfaceType('imageCapture', ImageCaptureInterface);

    // Resource actions
    this.app.resourceManager.define({
      name: 'imageCaptureAudit',
      actions: {
        async create(ctx, next) {
          const repo = ctx.db.getRepository('imageCaptureAudit');
          const values = ctx.action.params.values || {};
          values.serverTimestamp = values.serverTimestamp || new Date().toISOString();
          if (ctx.state?.currentUser) {
            values.capturedById = values.capturedById || ctx.state.currentUser.id;
            values.capturedByName =
              values.capturedByName || ctx.state.currentUser.nickname || ctx.state.currentUser.username || 'Unknown';
          }
          ctx.body = await repo.create({ values, context: ctx });
          await next();
        },
        async list(ctx, next) {
          const repo = ctx.db.getRepository('imageCaptureAudit');
          const { page = 1, pageSize = 20, filter, sort } = ctx.action.params;
          const [rows, count] = await repo.findAndCount({
            filter,
            sort: sort || ['-createdAt'],
            offset: (page - 1) * pageSize,
            limit: pageSize,
            context: ctx,
          });
          ctx.body = rows;
          ctx.meta = { count, page: Number(page), pageSize: Number(pageSize), totalPage: Math.ceil(count / pageSize) };
          await next();
        },
        async get(ctx, next) {
          const repo = ctx.db.getRepository('imageCaptureAudit');
          ctx.body = await repo.findOne({ filterByTk: ctx.action.params.filterByTk, context: ctx });
          await next();
        },
        async update(ctx) {
          ctx.throw(403, 'FDA 21 CFR Part 11: Audit records cannot be modified.');
        },
        async destroy(ctx) {
          ctx.throw(403, 'FDA 21 CFR Part 11: Audit records cannot be deleted.');
        },
      },
    });

    // ACL
    this.app.acl.allow('imageCaptureAudit', 'create', 'loggedIn');
    this.app.acl.allow('imageCaptureAudit', ['list', 'get'], 'loggedIn');
    this.app.acl.registerSnippet({ name: `pm.${this.name}`, actions: ['imageCaptureAudit:*'] });

    // Auto-audit on attachment creation for captures
    this.db.on('attachments.afterCreate', async (model: any, options: any) => {
      try {
        const mimetype = model.get('mimetype') || '';
        const filename = model.get('filename') || '';
        if (!mimetype.startsWith('image/') || !filename.match(/^capture_/)) return;
        const repo = this.db.getRepository('imageCaptureAudit');
        if (!repo) return;
        await repo.create({
          values: {
            attachmentId: model.get('id'),
            capturedAt: new Date().toISOString(),
            serverTimestamp: new Date().toISOString(),
            capturedById: options?.context?.state?.currentUser?.id || null,
            capturedByName: 'System (auto-audit)',
            action: 'CAPTURE_AUTO',
            metadata: { mimetype, filename, size: model.get('size'), autoCreated: true },
          },
        });
      } catch (err: any) {
        this.log.warn(`[pharma-image-capture] Auto-audit failed: ${err.message}`);
      }
    });

    // Immutability: prevent update of audit fields
    this.db.on('imageCaptureAudit.beforeUpdate', async (model: any) => {
      const immutable = [
        'attachmentId',
        'capturedAt',
        'serverTimestamp',
        'capturedById',
        'capturedByName',
        'latitude',
        'longitude',
        'accuracy',
        'barcode',
        'deviceInfo',
        'captureIndex',
        'imageHash',
        'action',
      ];
      const changed = model.changed() || [];
      const violated = changed.filter((f: string) => immutable.includes(f));
      if (violated.length > 0) {
        throw new Error(
          `FDA 21 CFR Part 11 Compliance Violation: Cannot modify immutable audit fields [${violated.join(', ')}].`,
        );
      }
    });

    // Immutability: prevent deletion
    this.db.on('imageCaptureAudit.beforeDestroy', async () => {
      throw new Error('FDA 21 CFR Part 11 Compliance Violation: Audit records cannot be deleted.');
    });

    this.log.info('[pharma-image-capture] Plugin loaded.');
  }

  async install() {
    this.log.info('[pharma-image-capture] Installed.');
  }
  async remove() {
    this.log.warn('[pharma-image-capture] Removed. Audit data retained for compliance.');
  }
}

export default PharmaImageCapturePlugin;
