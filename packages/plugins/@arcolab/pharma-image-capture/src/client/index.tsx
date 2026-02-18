/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { Plugin } from '@nocobase/client';
import { ImageCaptureFieldInterface } from './interfaces/ImageCaptureFieldInterface';
import { ImageCaptureField } from './components/ImageCaptureField';
import { ImageCaptureReadPretty } from './components/ImageCaptureReadPretty';
import { ImageCaptureSettings } from './components/ImageCaptureSettings';
import { useImageCaptureFieldProps } from './hooks/useImageCaptureFieldProps';
import { NAMESPACE } from './locale';

export class PharmaImageCapturePlugin extends Plugin {
  async load() {
    this.app.dataSourceManager.addFieldInterfaces([ImageCaptureFieldInterface]);
    this.app.addComponents({
      ImageCaptureField,
      'ImageCaptureField.ReadPretty': ImageCaptureReadPretty,
      ImageCaptureSettings,
    });
    this.app.addScopes({ useImageCaptureFieldProps });
    this.app.pluginSettingsManager.add(NAMESPACE, {
      title: `{{t("Pharma Image Capture", { ns: "${NAMESPACE}" })}}`,
      icon: 'CameraOutlined',
      Component: ImageCaptureSettings,
    });
  }
}

export default PharmaImageCapturePlugin;
