/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { DataTypes, Field } from '@nocobase/database';

export class ImageCaptureField extends Field {
  get dataType() {
    return DataTypes.JSON;
  }

  bind() {
    super.bind();
    this.on('beforeSave', this.validateCaptures.bind(this));
  }

  unbind() {
    super.unbind();
    this.off('beforeSave', this.validateCaptures.bind(this));
  }

  private async validateCaptures(model: any) {
    const value = model.get(this.options.name);
    if (!value) return;
    if (!Array.isArray(value)) throw new Error(`ImageCaptureField "${this.options.name}": Value must be an array.`);
    const max = this.options?.maxCaptures || 20;
    if (value.length > max)
      throw new Error(`ImageCaptureField "${this.options.name}": Exceeds max captures (${value.length}/${max}).`);
    for (let i = 0; i < value.length; i++) {
      if (value[i]?.meta && !value[i].meta.timestamp) {
        throw new Error(`ImageCaptureField "${this.options.name}": Capture ${i} missing timestamp.`);
      }
    }
  }
}
